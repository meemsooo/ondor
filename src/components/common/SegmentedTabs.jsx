import './SegmentedTabs.css';

/**
 * 세그먼트 탭 (상태 필터용) — 토스 스타일 언더라인 탭
 * @param {{id:string,label:string}[]} tabs
 * @param {string} value
 * @param {(id:string)=>void} onChange
 */
export default function SegmentedTabs({ tabs, value, onChange }) {
  return (
    <div className="seg-tabs no-scrollbar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          className={`seg-tabs__item ${value === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
