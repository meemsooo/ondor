// localStorage 기반 저장 헬퍼
//
// UI 컴포넌트는 절대 localStorage 를 직접 호출하지 않고
// 반드시 이 모듈(혹은 이 모듈을 사용하는 service)을 통해 접근한다.
// 추후 Firebase 등으로 교체할 때 이 파일과 각 service 만 바꾸면 된다.
import { currentUser } from '../config/currentUser';

/** 데이터 변경을 같은 탭의 다른 화면(예: 홈)에 알리기 위한 커스텀 이벤트 이름 */
export const STORAGE_EVENT = 'ondol:storage';

/** 저장소에서 배열을 읽어온다. 없거나 깨졌으면 빈 배열. */
export function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 저장소에 배열을 저장하고 변경 이벤트를 발행한다. */
export function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } finally {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STORAGE_EVENT));
    }
  }
}

/** 중복되지 않는 ID 생성 */
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

/**
 * 공통 게시글 컬렉션 service 팩토리.
 * 모든 게시글은 { id, type, authorId, authorName, createdAt, updatedAt } 공통 필드를 갖는다.
 */
export function createCollection(storageKey, type) {
  function getAll() {
    return readList(storageKey)
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  function getById(id) {
    return readList(storageKey).find((item) => String(item.id) === String(id)) ?? null;
  }

  function create(data) {
    const now = Date.now();
    const item = {
      ...data,
      id: generateId(),
      type,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: now,
      updatedAt: now,
    };
    writeList(storageKey, [item, ...readList(storageKey)]);
    return item;
  }

  function update(id, data) {
    const list = readList(storageKey);
    const idx = list.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...data,
      id: list[idx].id, // id 는 변경 불가
      type: list[idx].type,
      authorId: list[idx].authorId,
      createdAt: list[idx].createdAt,
      updatedAt: Date.now(),
    };
    list[idx] = updated;
    writeList(storageKey, list);
    return updated;
  }

  function remove(id) {
    const list = readList(storageKey).filter((item) => String(item.id) !== String(id));
    writeList(storageKey, list);
  }

  return { storageKey, getAll, getById, create, update, remove };
}

/** 현재 사용자가 작성한 글인지 여부 */
export function isMine(item) {
  return !!item && item.authorId === currentUser.id;
}
