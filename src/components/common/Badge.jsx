import './Badge.css';

/**
 * 상태 뱃지 / 태그
 * @param {'primary'|'success'|'info'|'warning'|'danger'|'muted'} tone
 */
export default function Badge({ children, tone = 'primary', className = '' }) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>;
}
