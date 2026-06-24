// 표시용 포매팅 유틸

/** 금액을 천 단위 쉼표 + 원 단위로 표시 */
export function formatWon(value) {
  const n = Math.round(Number(value) || 0);
  return `${n.toLocaleString()}원`;
}

/** 작성 시각(timestamp)을 상대 시간으로 표시 */
export function formatRelativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - Number(ts);
  if (diff < 0) return '방금 전';
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const d = new Date(Number(ts));
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** datetime-local 값 등 마감 일시를 "M월 D일 HH:MM" 으로 표시 */
export function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${mm}월 ${dd}일 ${hh}:${mi}`;
}

/** 마감 일시가 지났는지 여부 */
export function isPast(value) {
  if (!value) return false;
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}
