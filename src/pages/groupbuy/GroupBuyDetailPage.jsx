import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button, EmptyState } from '../../components/common';
import {
  getById,
  getStatus,
  perPersonPrice,
  remainingSlots,
  groupBuyStatusMeta,
  getCategory,
  isJoined,
  join,
  leave,
  cancelRecruiting,
  remove,
} from '../../services/groupBuyService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { isMine } from '../../services/storage';
import { formatWon, formatDateTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './GroupBuyDetailPage.css';

export default function GroupBuyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const gb = useLiveQuery(() => getById(id));
  const joined = useLiveQuery(() => isJoined(id));

  if (!gb) {
    return (
      <>
        <Header title="공동구매 상세" back showChat />
        <div className="page">
          <EmptyState
            emoji="🛒"
            title="게시글을 찾을 수 없어요"
            description="삭제되었거나 잘못된 주소예요."
            action={<Button onClick={() => navigate(PATHS.GROUPBUY)}>목록으로</Button>}
          />
        </div>
      </>
    );
  }

  const status = getStatus(gb);
  const meta = groupBuyStatusMeta[status];
  const cat = getCategory(gb.category);
  const mine = isMine(gb);
  const current = gb.currentCount ?? 1;
  const pct = Math.min(100, Math.round((current / gb.targetCount) * 100));

  const handleDelete = () => {
    if (!window.confirm('이 공동구매를 삭제할까요? 되돌릴 수 없어요.')) return;
    remove(id);
    alert('삭제되었어요.');
    navigate(PATHS.GROUPBUY, { replace: true });
  };

  const handleCancel = () => {
    if (!window.confirm('모집을 취소할까요?')) return;
    cancelRecruiting(id);
  };

  const handleJoin = () => {
    join(id);
    alert('공동구매에 참여했어요!');
  };

  const handleLeave = () => {
    leave(id);
  };

  // 하단 액션 버튼 구성
  let primary;
  if (mine) {
    primary =
      status === 'recruiting' ? (
        <Button size="lg" block variant="outline" onClick={handleCancel}>
          모집 취소하기
        </Button>
      ) : (
        <Button size="lg" block disabled>
          {meta.label}
        </Button>
      );
  } else if (joined) {
    primary = (
      <Button size="lg" block variant="outline" onClick={handleLeave}>
        참여 취소하기
      </Button>
    );
  } else if (status === 'recruiting') {
    primary = (
      <Button size="lg" block onClick={handleJoin}>
        공동구매 참여하기 ({formatWon(perPersonPrice(gb))})
      </Button>
    );
  } else {
    primary = (
      <Button size="lg" block disabled>
        {status === 'full' ? '모집이 완료됐어요' : status === 'canceled' ? '취소된 공구예요' : '마감된 공구예요'}
      </Button>
    );
  }

  return (
    <>
      <Header title="공동구매 상세" back showChat />

      <div className="gb-detail">
        {/* 대표 이미지 */}
        <div className="gb-detail__hero">
          {gb.image ? <img className="gb-detail__hero-img" src={gb.image} alt="" /> : (cat?.emoji ?? '🛒')}
        </div>

        <div className="page stack">
          <div>
            <div className="gb-detail__badges">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              {cat ? <Badge tone="muted">{cat.emoji} {cat.label}</Badge> : null}
            </div>
            <h2 className="gb-detail__title">{gb.title}</h2>
            {gb.deadline ? (
              <p className="gb-detail__deadline">⏰ {formatDateTime(gb.deadline)} 마감</p>
            ) : null}
          </div>

          {/* 상품 정보 */}
          <Card>
            <p className="gb-detail__section-label">상품 정보</p>
            <p className="gb-detail__product">{gb.productName}</p>
            {gb.productDesc ? <p className="gb-detail__desc">{gb.productDesc}</p> : null}
          </Card>

          {/* 가격 */}
          <Card className="gb-detail__price-card">
            <div className="gb-detail__price-row">
              <span>총 금액</span>
              <span>{formatWon(gb.totalPrice)}</span>
            </div>
            <div className="gb-detail__price-row">
              <span>목표 인원</span>
              <span>{gb.targetCount}명</span>
            </div>
            <div className="gb-detail__price-row gb-detail__price-row--main">
              <span>1인 예상 금액</span>
              <b>{formatWon(perPersonPrice(gb))}</b>
            </div>
          </Card>

          {/* 참여 현황 */}
          <Card>
            <div className="gb-detail__progress-head">
              <span className="gb-detail__progress-label">참여 현황</span>
              <span className="gb-detail__progress-count">
                {current}/{gb.targetCount}명
              </span>
            </div>
            <div className="gb-detail__bar">
              <div className="gb-detail__bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="gb-detail__remain">
              {status === 'full'
                ? '모집이 완료됐어요 🎉'
                : `남은 모집 인원 ${remainingSlots(gb)}명`}
            </p>
          </Card>

          {/* 수령 정보 */}
          <Card>
            <div className="gb-detail__info-row">
              <span className="gb-detail__info-key">📍 수령/만남</span>
              <span className="gb-detail__info-val">{gb.location}</span>
            </div>
            {gb.pickupTime ? (
              <div className="gb-detail__info-row">
                <span className="gb-detail__info-key">🕒 수령 시간</span>
                <span className="gb-detail__info-val">{gb.pickupTime}</span>
              </div>
            ) : null}
            {gb.caution ? (
              <div className="gb-detail__info-row">
                <span className="gb-detail__info-key">⚠️ 주의사항</span>
                <span className="gb-detail__info-val">{gb.caution}</span>
              </div>
            ) : null}
          </Card>

          {/* 개설자 */}
          <Card>
            <div className="gb-detail__host">
              <Avatar emoji="🧑" size="md" />
              <div>
                <p className="gb-detail__host-name">{gb.authorName}</p>
                <p className="gb-detail__host-loc">개설자</p>
              </div>
            </div>
          </Card>

          {/* 작성자: 수정/삭제 */}
          {mine ? (
            <div className="form-actions">
              <Button variant="outline" onClick={() => navigate(to.groupBuyEdit(id))}>
                수정
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* 하단 고정 액션 */}
      <div className="gb-detail__action">{primary}</div>
    </>
  );
}
