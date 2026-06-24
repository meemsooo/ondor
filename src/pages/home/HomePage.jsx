import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SectionHeader, Avatar } from '../../components/common';
import { homeShortcuts } from '../../config/navigation';
import { currentUser } from '../../config/currentUser';
import { PATHS, to } from '../../routes/paths';
import { fetchDormNotices } from '../../services/noticeService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import {
  getAll as getHelpRequests,
  getHelpType,
} from '../../services/helpRequestService';
import {
  getAll as getGroupBuys,
  getStatus,
  perPersonPrice,
  getCategory,
} from '../../services/groupBuyService';
import { getAll as getCommunityPosts, getBoard } from '../../services/communityService';
import { formatWon, formatRelativeTime } from '../../utils/format';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [dormNotices, setDormNotices] = useState([]);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const notices = await fetchDormNotices();
        setDormNotices(notices);
      } catch (error) {
        console.error('Failed to load dorm notices:', error);
        setDormNotices([]);
      }
    };
    loadNotices();
  }, []);

  const recentHelp = useLiveQuery(() => getHelpRequests().slice(0, 2));
  const recentGroupBuy = useLiveQuery(() =>
    getGroupBuys().filter((g) => getStatus(g) === 'recruiting').slice(0, 2)
  );
  const recentPosts = useLiveQuery(() => getCommunityPosts().slice(0, 3));
  const latestDormNotice = dormNotices.length > 0 ? dormNotices[0] : null;

  return (
    <>
      <Header
        title="🔥 온돌"
        showChat
        right={
          <div className="home-header-right">
            <button
              className="home-notice-btn"
              onClick={() => navigate(PATHS.NOTICES)}
              aria-label="공지사항"
              title="기숙사 공지사항"
            >
              🔔
              <span className="home-notice-badge"></span>
            </button>
            <button className="home-profile-btn" onClick={() => navigate(PATHS.MYPAGE)}>
              <Avatar emoji={currentUser.avatar} size="sm" />
            </button>
          </div>
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

        {/* 공지사항 배너 (기존 기숙사 공지 기능 유지) */}
        {latestDormNotice ? (
          <Card className="home-notice" onClick={() => navigate(PATHS.NOTICES)}>
            <span className="home-notice__tag">📢 공지</span>
            <span className="home-notice__text line-clamp-1">{latestDormNotice.title}</span>
            <span className="home-notice__arrow">›</span>
          </Card>
        ) : null}

        {/* 카테고리 바로가기 */}
        <div className="home-shortcuts">
          {homeShortcuts.map((s) => (
            <button key={s.id} className="home-shortcut" onClick={() => navigate(s.path)}>
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
            {recentHelp.length === 0 ? (
              <Card className="home-empty" onClick={() => navigate(PATHS.HELP_NEW)}>
                아직 등록된 도움요청이 없어요. 작성하러 가기 ›
              </Card>
            ) : (
              recentHelp.map((h) => {
                const cat = getHelpType(h.typeId);
                return (
                  <Card key={h.id} onClick={() => navigate(to.helpDetail(h.id))}>
                    <div className="home-row">
                      <div className="home-row__main">
                        <div className="home-row__top">
                          <Badge tone="muted">{cat?.emoji} {cat?.label}</Badge>
                          <span className="home-row__time">{formatRelativeTime(h.createdAt)}</span>
                        </div>
                        <p className="home-row__title line-clamp-1">{h.title}</p>
                        {h.location ? <p className="home-row__sub">📍 {h.location}</p> : null}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* 진행 중 공동구매 */}
        <section>
          <SectionHeader title="🛒 모집중 공동구매" onAction={() => navigate(PATHS.GROUPBUY)} />
          {recentGroupBuy.length === 0 ? (
            <Card className="home-empty" onClick={() => navigate(PATHS.GROUPBUY_NEW)}>
              아직 모집 중인 공동구매가 없어요. 만들러 가기 ›
            </Card>
          ) : (
            <div className="home-hscroll no-scrollbar">
              {recentGroupBuy.map((g) => {
                const cat = getCategory(g.category);
                return (
                  <Card
                    key={g.id}
                    className="home-gb-card"
                    onClick={() => navigate(to.groupBuyDetail(g.id))}
                  >
                    <div className="home-gb-card__emoji">
                      {g.image ? <img className="home-gb-card__img" src={g.image} alt="" /> : (cat?.emoji ?? '🛒')}
                    </div>
                    <p className="home-gb-card__title line-clamp-2">{g.title}</p>
                    <p className="home-gb-card__price">1인 {formatWon(perPersonPrice(g))}</p>
                    <Badge tone="primary">
                      {g.currentCount ?? 1}/{g.targetCount}명
                    </Badge>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* 최근 게시글 */}
        <section>
          <SectionHeader title="💬 최근 게시글" onAction={() => navigate(PATHS.COMMUNITY)} />
          {recentPosts.length === 0 ? (
            <Card className="home-empty" onClick={() => navigate(PATHS.COMMUNITY_NEW)}>
              아직 게시글이 없어요. 글 쓰러 가기 ›
            </Card>
          ) : (
            <Card padded={false}>
              {recentPosts.map((p, i) => {
                const board = getBoard(p.boardId);
                return (
                  <button
                    key={p.id}
                    className={`home-post ${i > 0 ? 'home-post--divider' : ''}`}
                    onClick={() => navigate(to.communityDetail(p.id))}
                  >
                    <span className="home-post__board">{board?.emoji}</span>
                    <span className="home-post__title line-clamp-1">{p.title}</span>
                    <span className="home-post__time">{formatRelativeTime(p.createdAt)}</span>
                  </button>
                );
              })}
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
