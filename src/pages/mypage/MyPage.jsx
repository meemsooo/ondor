import { useNavigate } from 'react-router-dom';
import { Header, Card, Avatar } from '../../components/common';
import { currentUser } from '../../data';
import { PATHS } from '../../routes/paths';
import './MyPage.css';

// 활동 내역 요약 (더미)
const activityStats = [
  { label: '도움 준 횟수', value: 12, emoji: '🤝' },
  { label: '공동구매', value: 8, emoji: '🛒' },
  { label: '대여', value: 5, emoji: '📦' },
];

const menuGroups = [
  {
    title: '활동',
    items: [
      { label: '내 도움 요청', emoji: '🙋', path: PATHS.HELP },
      { label: '참여한 공동구매', emoji: '🛒', path: PATHS.GROUPBUY },
      { label: '대여 내역', emoji: '📦', path: PATHS.RENTAL_HISTORY },
      { label: '룸메이트 매칭', emoji: '🛏️', path: PATHS.ROOMMATE },
    ],
  },
  {
    title: '설정',
    items: [
      { label: '알림 설정', emoji: '🔔' },
      { label: '내 동/호수 변경', emoji: '🏠' },
      { label: '고객센터', emoji: '💬' },
      { label: '로그아웃', emoji: '👋' },
    ],
  },
];

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="마이페이지" />
      <div className="page stack">
        {/* 프로필 */}
        <Card className="mypage-profile">
          <Avatar emoji={currentUser.avatar} size="lg" />
          <div className="mypage-profile__info">
            <p className="mypage-profile__name">{currentUser.nickname}</p>
            <p className="mypage-profile__loc">
              📍 {currentUser.dorm} {currentUser.room}
            </p>
          </div>
          <button className="mypage-profile__edit" onClick={() => alert('프로필 편집 (더미)')}>
            편집
          </button>
        </Card>

        {/* 온돌지수 */}
        <Card className="mypage-score">
          <div className="mypage-score__head">
            <span className="mypage-score__label">🔥 온돌지수</span>
            <span className="mypage-score__temp">{currentUser.temperature}</span>
          </div>
          <div className="mypage-score__value">{currentUser.ondolScore}°</div>
          <div className="mypage-score__bar">
            <div
              className="mypage-score__fill"
              style={{ width: `${currentUser.ondolScore}%` }}
            />
          </div>
          <p className="mypage-score__hint">이웃에게 받은 신뢰가 온돌처럼 따뜻하게 쌓여요</p>
        </Card>

        {/* 활동 내역 요약 */}
        <Card className="mypage-stats">
          {activityStats.map((s) => (
            <div key={s.label} className="mypage-stat">
              <span className="mypage-stat__emoji">{s.emoji}</span>
              <span className="mypage-stat__value">{s.value}</span>
              <span className="mypage-stat__label">{s.label}</span>
            </div>
          ))}
        </Card>

        {/* 메뉴 */}
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mypage-menu__title">{group.title}</p>
            <Card padded={false}>
              {group.items.map((item, i) => (
                <button
                  key={item.label}
                  className={`mypage-menu__item ${i > 0 ? 'mypage-menu__item--divider' : ''}`}
                  onClick={() => (item.path ? navigate(item.path) : alert(`${item.label} (더미)`))}
                >
                  <span className="mypage-menu__emoji">{item.emoji}</span>
                  <span className="mypage-menu__label">{item.label}</span>
                  <span className="mypage-menu__arrow">›</span>
                </button>
              ))}
            </Card>
          </div>
        ))}

        <p className="mypage-version">OnDol v0.1.0 (MVP)</p>
      </div>
    </>
  );
}
