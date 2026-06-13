import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SectionHeader, Avatar } from '../../components/common';
import { homeShortcuts } from '../../config/navigation';
import { PATHS, to } from '../../routes/paths';
import {
  currentUser,
  helpRequests,
  groupBuys,
  communityPosts,
  noticeList,
  helpStatusMeta,
  groupBuyStatusMeta,
  receivedPokes,
} from '../../data';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const recentHelp = helpRequests.slice(0, 2);
  const recentGroupBuy = groupBuys.filter((g) => g.status === 'recruiting').slice(0, 2);
  const popularPosts = [...communityPosts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const latestNotice = noticeList[0];
  const unreadPokeCount = receivedPokes.filter((p) => !p.isRead).length;

  return (
    <>
      <Header
        title="🔥 온돌"
        showChat
        right={
          <>
            <button
              className="app-header__icon-btn home-poke-btn"
              onClick={() => navigate(PATHS.POKE_SEND)}
              aria-label="콕 찌르기"
            >
              👉
              {unreadPokeCount > 0 && (
                <span className="home-poke-btn__count">{unreadPokeCount}</span>
              )}
            </button>
            <button className="home-profile-btn" onClick={() => navigate(PATHS.MYPAGE)}>
              <Avatar emoji={currentUser.avatar} size="sm" />
            </button>
          </>
        }
      />

      <div className="page stack home">
        {/* 인사 + 위치 */}
        <div className="home-greeting">
          <p className="home-greeting__hello">
            <b>{currentUser.nickname}</b>님, 오늘도 따뜻한 하루 보내세요 ☀️
          </p>
          <p className="home-greeting__loc">📍 {currentUser.dorm}</p>
        </div>

        {/* 공지사항 배너 */}
        {latestNotice ? (
          <Card className="home-notice" onClick={() => navigate(PATHS.COMMUNITY)}>
            <span className="home-notice__tag">📢 공지</span>
            <span className="home-notice__text line-clamp-1">{latestNotice.title}</span>
            <span className="home-notice__arrow">›</span>
          </Card>
        ) : null}

        {/* 카테고리 바로가기 */}
        <div className="home-shortcuts">
          {homeShortcuts.map((s) => (
            <button
              key={s.id}
              className="home-shortcut"
              onClick={() => navigate(s.path)}
            >
              <span className="home-shortcut__icon" style={{ background: s.color }}>
                {s.emoji}
              </span>
              <span className="home-shortcut__label">{s.label}</span>
            </button>
          ))}
        </div>

        {/* 최근 도움 요청 */}
        <section>
          <SectionHeader title="🙋 최근 도움 요청" onAction={() => navigate(PATHS.HELP)} />
          <div className="stack">
            {recentHelp.map((h) => (
              <Card key={h.id} onClick={() => navigate(to.helpMatching(h.id))}>
                <div className="home-row">
                  <div className="home-row__main">
                    <div className="home-row__top">
                      <Badge tone={helpStatusMeta[h.status].tone}>
                        {helpStatusMeta[h.status].label}
                      </Badge>
                      <span className="home-row__time">{h.createdAt}</span>
                    </div>
                    <p className="home-row__title line-clamp-1">{h.title}</p>
                    <p className="home-row__sub">📍 {h.location} · 사례 {h.reward}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 최근 공동구매 */}
        <section>
          <SectionHeader title="🛒 모집중 공동구매" onAction={() => navigate(PATHS.GROUPBUY)} />
          <div className="home-hscroll no-scrollbar">
            {recentGroupBuy.map((g) => (
              <Card
                key={g.id}
                className="home-gb-card"
                onClick={() => navigate(to.groupBuyDetail(g.id))}
              >
                <div className="home-gb-card__emoji">{g.emoji}</div>
                <p className="home-gb-card__title line-clamp-2">{g.title}</p>
                <p className="home-gb-card__price">1인 {g.perPerson.toLocaleString()}원</p>
                <Badge tone={groupBuyStatusMeta[g.status].tone}>
                  {g.current}/{g.target}명
                </Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* 인기 게시글 */}
        <section>
          <SectionHeader title="🔥 인기 게시글" onAction={() => navigate(PATHS.COMMUNITY)} />
          <Card padded={false}>
            {popularPosts.map((p, i) => (
              <button
                key={p.id}
                className={`home-post ${i > 0 ? 'home-post--divider' : ''}`}
                onClick={() => navigate(PATHS.COMMUNITY)}
              >
                <span className="home-post__rank">{i + 1}</span>
                <span className="home-post__title line-clamp-1">{p.title}</span>
                <span className="home-post__likes">♥ {p.likes}</span>
              </button>
            ))}
          </Card>
        </section>
      </div>
    </>
  );
}
