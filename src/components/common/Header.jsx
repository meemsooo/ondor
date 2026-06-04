import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import './Header.css';

/**
 * 상단 헤더
 * @param {string} title
 * @param {boolean} back - 뒤로가기 버튼 표시
 * @param {boolean} showChat - 채팅 아이콘 표시
 * @param {React.ReactNode} right - 우측 커스텀 영역
 */
export default function Header({ title, back = false, showChat = false, right = null }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__left">
        {back ? (
          <button className="app-header__icon-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
            ‹
          </button>
        ) : null}
        <h1 className="app-header__title">{title}</h1>
      </div>
      <div className="app-header__right">
        {right}
        {showChat ? (
          <button
            className="app-header__icon-btn"
            onClick={() => navigate(PATHS.CHAT)}
            aria-label="채팅"
          >
            ✉️
          </button>
        ) : null}
      </div>
    </header>
  );
}
