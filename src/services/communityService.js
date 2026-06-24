// 커뮤니티 service
import { createCollection } from './storage';

const STORAGE_KEY = 'ondol.communityPosts';
const base = createCollection(STORAGE_KEY, 'community');

/** 게시판 종류 */
export const COMMUNITY_BOARDS = [
  { id: 'free', label: '자유게시판', emoji: '💬' },
  { id: 'info', label: '정보공유', emoji: '💡' },
  { id: 'social', label: '소통·친목', emoji: '🤝' },
];

export function getBoard(id) {
  return COMMUNITY_BOARDS.find((b) => b.id === id) ?? null;
}

export const getAll = base.getAll;
export const getById = base.getById;
export const create = base.create;
export const update = base.update;
export const remove = base.remove;
