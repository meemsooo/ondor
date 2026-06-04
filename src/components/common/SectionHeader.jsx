import './SectionHeader.css';

/**
 * 섹션 타이틀 + 더보기
 */
export default function SectionHeader({ title, actionLabel = '더보기', onAction }) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {onAction ? (
        <button className="section-header__action" onClick={onAction}>
          {actionLabel} ›
        </button>
      ) : null}
    </div>
  );
}
