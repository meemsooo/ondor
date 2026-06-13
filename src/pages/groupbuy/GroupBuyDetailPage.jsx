import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button } from '../../components/common';
import { groupBuys, groupBuyStatusMeta } from '../../data';
import { PATHS } from '../../routes/paths';
import './GroupBuyDetailPage.css';

export default function GroupBuyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gb = groupBuys.find((g) => g.id === id) ?? groupBuys[0];
  const pct = Math.round((gb.current / gb.target) * 100);
  const closed = gb.status === 'done';

  return (
    <>
      <Header title="공동구매 상세" back showChat />

      <div className="gb-detail">
        {/* 대표 이미지 영역 (이모지로 대체) */}
        <div className="gb-detail__hero">{gb.emoji}</div>

        <div className="page stack">
          <div>
            <Badge tone={groupBuyStatusMeta[gb.status].tone}>
              {groupBuyStatusMeta[gb.status].label}
            </Badge>
            <h2 className="gb-detail__title">{gb.title}</h2>
            <p className="gb-detail__deadline">⏰ {gb.deadline}</p>
          </div>

          {/* 가격 */}
          <Card className="gb-detail__price-card">
            <div className="gb-detail__price-row">
              <span>총 금액</span>
              <span>{gb.price.toLocaleString()}원</span>
            </div>
            <div className="gb-detail__price-row gb-detail__price-row--main">
              <span>1인 부담금</span>
              <b>{gb.perPerson.toLocaleString()}원</b>
            </div>
          </Card>

          {/* 참여 현황 */}
          <Card>
            <div className="gb-detail__progress-head">
              <span className="gb-detail__progress-label">참여 현황</span>
              <span className="gb-detail__progress-count">
                {gb.current}/{gb.target}명
              </span>
            </div>
            <div className="gb-detail__bar">
              <div className="gb-detail__bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="gb-detail__avatars">
              {Array.from({ length: gb.current }).map((_, i) => (
                <Avatar key={i} emoji="🙂" size="sm" />
              ))}
              {Array.from({ length: gb.target - gb.current }).map((_, i) => (
                <span key={`e${i}`} className="gb-detail__avatar-empty">＋</span>
              ))}
            </div>
          </Card>

          {/* 개설자 */}
          <Card>
            <div className="gb-detail__host">
              <Avatar emoji="🐰" size="md" />
              <div>
                <p className="gb-detail__host-name">{gb.host}</p>
                <p className="gb-detail__host-loc">📍 {gb.location}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 하단 고정 액션 */}
      <div className="gb-detail__action">
        <Button
          size="lg"
          block
          disabled={closed}
          onClick={() => navigate(PATHS.CHAT)}
        >
          {closed ? '마감된 공구예요' : `공동구매 참여하기 (${gb.perPerson.toLocaleString()}원)`}
        </Button>
      </div>
    </>
  );
}
