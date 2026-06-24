import './EmptyState.css';

/**
 * 빈 상태 표시
 * @param {React.ReactNode} action - 하단에 표시할 버튼 등 (선택)
 */
export default function EmptyState({ emoji = '📭', title = '아직 내용이 없어요', description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__emoji">{emoji}</div>
      <p className="empty-state__title">{title}</p>
      {description ? <p className="empty-state__desc">{description}</p> : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
