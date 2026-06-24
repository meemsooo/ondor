import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB, Button } from '../../components/common';
import {
  getAll,
  getStatus,
  perPersonPrice,
  groupBuyStatusMeta,
  getCategory,
} from '../../services/groupBuyService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { formatWon, formatDateTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './GroupBuyPage.css';

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'recruiting', label: '모집중' },
  { id: 'full', label: '모집완료' },
  { id: 'closed', label: '마감' },
];

export default function GroupBuyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const all = useLiveQuery(getAll);
  const list = all.filter((g) => {
    if (tab === 'all') return true;
    const status = getStatus(g);
    if (tab === 'closed') return status === 'closed' || status === 'canceled';
    return status === tab;
  });

  return (
    <>
      <Header title="공동구매" showChat />
      <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="page stack">
        {all.length === 0 ? (
          <EmptyState
            emoji="🛒"
            title="아직 모집 중인 공동구매가 없어요"
            description="첫 공동구매를 만들어보세요!"
            action={
              <Button onClick={() => navigate(PATHS.GROUPBUY_NEW)}>공동구매 만들기</Button>
            }
          />
        ) : list.length === 0 ? (
          <EmptyState emoji="🛒" title="해당하는 공동구매가 없어요" />
        ) : (
          list.map((g) => {
            const status = getStatus(g);
            const meta = groupBuyStatusMeta[status];
            const cat = getCategory(g.category);
            const pct = Math.min(100, Math.round(((g.currentCount ?? 1) / g.targetCount) * 100));
            return (
              <Card key={g.id} onClick={() => navigate(to.groupBuyDetail(g.id))}>
                <div className="gb-card">
                  <div className="gb-card__emoji">
                    {g.image ? (
                      <img className="gb-card__img" src={g.image} alt="" />
                    ) : (
                      cat?.emoji ?? '🛒'
                    )}
                  </div>
                  <div className="gb-card__body">
                    <div className="gb-card__head">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      <span className="gb-card__deadline">
                        {g.deadline ? `~${formatDateTime(g.deadline)}` : ''}
                      </span>
                    </div>
                    <p className="gb-card__title line-clamp-1">{g.title}</p>
                    <p className="gb-card__price">
                      1인 <b>{formatWon(perPersonPrice(g))}</b>
                      <span className="gb-card__total"> · 총 {formatWon(g.totalPrice)}</span>
                    </p>
                    <div className="gb-progress">
                      <div className="gb-progress__bar">
                        <div className="gb-progress__fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="gb-progress__count">
                        {g.currentCount ?? 1}/{g.targetCount}명
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FAB label="공동구매 만들기" onClick={() => navigate(PATHS.GROUPBUY_NEW)} />
    </>
  );
}
