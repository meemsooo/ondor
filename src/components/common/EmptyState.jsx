import './EmptyState.css';

/**
 * 빈 상태 표시
 */
export default function EmptyState({ emoji = '📭', title = '아직 내용이 없어요', description }) {
  return (
    <div className="empty-state">
      <div className="empty-state__emoji">{emoji}</div>
      <p className="empty-state__title">{title}</p>
      {description ? <p className="empty-state__desc">{description}</p> : null}
    </div>
  );
}
