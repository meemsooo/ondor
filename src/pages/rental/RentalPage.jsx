import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB, Button } from '../../components/common';
import { getAll, getRentalType } from '../../services/rentalService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { formatWon } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './RentalPage.css';

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'offer', label: '빌려드려요' },
  { id: 'request', label: '빌려주세요' },
];

function priceLabel(r) {
  const n = Number(r.priceRange);
  if (!n) return '무료';
  return formatWon(n);
}

export default function RentalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const all = useLiveQuery(getAll);
  const list = all.filter((r) => tab === 'all' || r.rentalType === tab);

  return (
    <>
      <Header
        title="물건 대여"
        showChat
        right={
          <button className="rental-history-btn" onClick={() => navigate(PATHS.RENTAL_HISTORY)}>
            내역
          </button>
        }
      />
      <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="page">
        {all.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="아직 등록된 대여 물품이 없어요"
            description="첫 대여 물품을 등록해보세요!"
            action={<Button onClick={() => navigate(PATHS.RENTAL_NEW)}>물품 등록</Button>}
          />
        ) : list.length === 0 ? (
          <EmptyState emoji="📦" title="해당하는 물품이 없어요" />
        ) : (
          <div className="rental-grid">
            {list.map((r) => {
              const meta = getRentalType(r.rentalType);
              return (
                <Card key={r.id} className="rental-item" onClick={() => navigate(to.rentalDetail(r.id))}>
                  <div className="rental-item__thumb">📦</div>
                  <Badge tone={meta?.tone ?? 'muted'}>{meta?.label}</Badge>
                  <p className="rental-item__title line-clamp-2">{r.itemName}</p>
                  <p className="rental-item__fee">{priceLabel(r)}</p>
                  {r.location ? <p className="rental-item__loc">📍 {r.location}</p> : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <FAB label="물건 등록" onClick={() => navigate(PATHS.RENTAL_NEW)} />
    </>
  );
}
