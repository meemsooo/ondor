import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, EmptyState, Button } from '../../components/common';
import { getAll, getRentalType } from '../../services/rentalService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { isMine } from '../../services/storage';
import { formatRelativeTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './RentalHistoryPage.css';

export default function RentalHistoryPage() {
  const navigate = useNavigate();
  const all = useLiveQuery(getAll);
  const mineList = all.filter(isMine);

  return (
    <>
      <Header title="내 대여 글" back />
      <div className="page stack">
        {mineList.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="아직 등록한 대여 물품이 없어요"
            action={<Button onClick={() => navigate(PATHS.RENTAL_NEW)}>물품 등록</Button>}
          />
        ) : (
          mineList.map((r) => {
            const meta = getRentalType(r.rentalType);
            return (
              <Card key={r.id} onClick={() => navigate(to.rentalDetail(r.id))}>
                <div className="rh-row">
                  <div className="rh-row__info">
                    <div className="rh-row__head">
                      <Badge tone={meta?.tone ?? 'muted'}>{meta?.label}</Badge>
                      <span className="rh-row__title">{r.itemName}</span>
                    </div>
                    <p className="rh-row__sub">{formatRelativeTime(r.createdAt)}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
