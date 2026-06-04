import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB } from '../../components/common';
import { rentals, rentalTypeMeta } from '../../data';
import { PATHS } from '../../routes/paths';
import './RentalPage.css';

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'offer', label: '빌려드려요' },
  { id: 'request', label: '빌려주세요' },
];

export default function RentalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const list = rentals.filter((r) => tab === 'all' || r.type === tab);

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
        {list.length === 0 ? (
          <EmptyState emoji="📦" title="등록된 물건이 없어요" />
        ) : (
          <div className="rental-grid">
            {list.map((r) => (
              <Card key={r.id} className="rental-item" onClick={() => alert(`${r.title} 상세 (더미)`)}>
                <div className="rental-item__thumb">
                  {r.emoji}
                  {r.status === 'rented' ? (
                    <span className="rental-item__overlay">대여중</span>
                  ) : null}
                </div>
                <Badge tone={rentalTypeMeta[r.type].tone}>{rentalTypeMeta[r.type].label}</Badge>
                <p className="rental-item__title line-clamp-2">{r.title}</p>
                <p className="rental-item__fee">{r.fee}</p>
                <p className="rental-item__loc">📍 {r.location}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FAB label="물건 등록" onClick={() => navigate(PATHS.RENTAL_REGISTER)} />
    </>
  );
}
