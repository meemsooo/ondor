import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB } from '../../components/common';
import { groupBuys, groupBuyStatusMeta } from '../../data';
import { to } from '../../routes/paths';
import './GroupBuyPage.css';

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'recruiting', label: '모집중' },
  { id: 'ongoing', label: '진행중' },
  { id: 'done', label: '완료' },
];

export default function GroupBuyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const list = groupBuys.filter((g) => tab === 'all' || g.status === tab);

  return (
    <>
      <Header title="공동구매" showChat />
      <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="page stack">
        {list.length === 0 ? (
          <EmptyState emoji="🛒" title="해당하는 공동구매가 없어요" />
        ) : (
          list.map((g) => {
            const pct = Math.round((g.current / g.target) * 100);
            return (
              <Card key={g.id} onClick={() => navigate(to.groupBuyDetail(g.id))}>
                <div className="gb-card">
                  <div className="gb-card__emoji">{g.emoji}</div>
                  <div className="gb-card__body">
                    <div className="gb-card__head">
                      <Badge tone={groupBuyStatusMeta[g.status].tone}>
                        {groupBuyStatusMeta[g.status].label}
                      </Badge>
                      <span className="gb-card__deadline">{g.deadline}</span>
                    </div>
                    <p className="gb-card__title line-clamp-1">{g.title}</p>
                    <p className="gb-card__price">
                      1인 <b>{g.perPerson.toLocaleString()}원</b>
                      <span className="gb-card__total"> · 총 {g.price.toLocaleString()}원</span>
                    </p>
                    <div className="gb-progress">
                      <div className="gb-progress__bar">
                        <div className="gb-progress__fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="gb-progress__count">
                        {g.current}/{g.target}명
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FAB label="공구 열기" onClick={() => alert('공동구매 개설 (더미)')} />
    </>
  );
}
