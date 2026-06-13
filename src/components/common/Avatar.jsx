import './Avatar.css';

/**
 * 이모지 기반 아바타 (MVP — 실제 이미지 대신 이모지 사용)
 * @param {'sm'|'md'|'lg'} size
 */
export default function Avatar({ emoji = '🧑', size = 'md', className = '' }) {
  return <span className={`avatar avatar--${size} ${className}`}>{emoji}</span>;
}
