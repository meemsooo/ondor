// 물건대여 service
import { createCollection } from './storage';

const STORAGE_KEY = 'ondol.rentals';
const base = createCollection(STORAGE_KEY, 'rental');

/** 등록 가능한 물건 최대 가격 (50만원 초과 등록 불가) */
export const MAX_PRICE = 500000;

/** 대여 구분 */
export const RENTAL_TYPES = [
  { id: 'request', label: '빌려주세요', tone: 'info' },
  { id: 'offer', label: '빌려드려요', tone: 'primary' },
];

export function getRentalType(id) {
  return RENTAL_TYPES.find((t) => t.id === id) ?? null;
}

export const getAll = base.getAll;
export const getById = base.getById;
export const create = base.create;
export const update = base.update;
export const remove = base.remove;
