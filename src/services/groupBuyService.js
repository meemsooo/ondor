// 공동구매 service
// 현재는 localStorage 사용. 추후 Firebase 등으로 교체 시 이 파일만 변경.
import { createCollection, readList, writeList } from './storage';
import { isPast } from '../utils/format';

const STORAGE_KEY = 'ondol.groupBuys';
const JOIN_KEY = 'ondol.groupBuys.joined'; // 같은 브라우저에서 참여한 공구 id 목록

const base = createCollection(STORAGE_KEY, 'groupBuy');

/** 카테고리 정의 (식품 / 생필품 / 배달 / 기타) */
export const GROUP_BUY_CATEGORIES = [
  { id: 'food', label: '식품', emoji: '🍙' },
  { id: 'daily', label: '생필품', emoji: '🧻' },
  { id: 'delivery', label: '배달', emoji: '🛵' },
  { id: 'etc', label: '기타', emoji: '📦' },
];

export function getCategory(id) {
  return GROUP_BUY_CATEGORIES.find((c) => c.id === id) ?? null;
}

/** 상태 표시 메타 */
export const groupBuyStatusMeta = {
  recruiting: { label: '모집중', tone: 'primary' },
  full: { label: '모집완료', tone: 'success' },
  closed: { label: '마감', tone: 'muted' },
  canceled: { label: '모집취소', tone: 'danger' },
};

/** 게시글의 현재 상태를 계산한다. */
export function getStatus(gb) {
  if (!gb) return 'closed';
  if (gb.canceled) return 'canceled';
  if (isPast(gb.deadline)) return 'closed';
  if ((gb.currentCount ?? 1) >= Number(gb.targetCount || 0)) return 'full';
  return 'recruiting';
}

/** 1인당 예상 금액 (전체 금액 ÷ 현재 참여 인원) */
export function perPersonPrice(gb) {
  const count = Math.max(1, gb?.currentCount ?? 1);
  return Math.round((Number(gb?.totalPrice) || 0) / count);
}

/** 남은 모집 인원 */
export function remainingSlots(gb) {
  return Math.max(0, Number(gb?.targetCount || 0) - (gb?.currentCount ?? 1));
}

// ----- 참여 상태 (같은 브라우저 기준 중복 참여 방지) -----
function getJoinedIds() {
  return readList(JOIN_KEY);
}

export function isJoined(id) {
  return getJoinedIds().includes(String(id));
}

// ----- 기본 CRUD -----
export const getAll = base.getAll;
export const getById = base.getById;
export const update = base.update;

/** 작성 시 현재 참여 인원은 1명(작성자)으로 자동 설정 */
export function create(data) {
  return base.create({ ...data, currentCount: 1, canceled: false });
}

export function remove(id) {
  // 게시글 삭제 시 참여 기록도 정리
  writeList(JOIN_KEY, getJoinedIds().filter((x) => x !== String(id)));
  base.remove(id);
}

/** 참여하기 — 현재 참여 인원 1명 증가 */
export function join(id) {
  const gb = base.getById(id);
  if (!gb) return null;
  if (getStatus(gb) !== 'recruiting') return gb; // 모집완료/마감/취소 시 참여 불가
  if (isJoined(id)) return gb; // 중복 참여 방지
  const updated = base.update(id, { currentCount: (gb.currentCount ?? 1) + 1 });
  writeList(JOIN_KEY, [...getJoinedIds(), String(id)]);
  return updated;
}

/** 참여 취소 — 현재 참여 인원 1명 감소 */
export function leave(id) {
  const gb = base.getById(id);
  if (!gb) return null;
  if (!isJoined(id)) return gb;
  const next = Math.max(1, (gb.currentCount ?? 1) - 1);
  const updated = base.update(id, { currentCount: next });
  writeList(JOIN_KEY, getJoinedIds().filter((x) => x !== String(id)));
  return updated;
}

/** 모집 취소 (작성자) */
export function cancelRecruiting(id) {
  return base.update(id, { canceled: true });
}
