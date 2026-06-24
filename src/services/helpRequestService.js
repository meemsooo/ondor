// 도움요청 service
import { createCollection } from './storage';

const STORAGE_KEY = 'ondol.helpRequests';
const base = createCollection(STORAGE_KEY, 'helpRequest');

/** 도움 유형 */
export const HELP_TYPES = [
  { id: 'bug', label: '벌레 잡기', emoji: '🐛' },
  { id: 'move', label: '무거운 짐 옮기기', emoji: '📦' },
  { id: 'etc', label: '기타 생활 도움', emoji: '🙋' },
];

export function getHelpType(id) {
  return HELP_TYPES.find((t) => t.id === id) ?? null;
}

export const getAll = base.getAll;
export const getById = base.getById;
export const create = base.create;
export const update = base.update;
export const remove = base.remove;
