import './FAB.css';

/**
 * 플로팅 액션 버튼 (글쓰기/등록 등)
 */
export default function FAB({ label = '글쓰기', icon = '✏️', onClick }) {
  return (
    <button className="fab" onClick={onClick}>
      <span className="fab__icon">{icon}</span>
      <span className="fab__label">{label}</span>
    </button>
  );
}
