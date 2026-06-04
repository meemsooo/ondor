import { Header, Card, Badge, EmptyState } from '../../components/common';
import { rentalHistory } from '../../data';
import './RentalHistoryPage.css';

export default function RentalHistoryPage() {
  return (
    <>
      <Header title="대여 내역" back />
      <div className="page stack">
        {rentalHistory.length === 0 ? (
          <EmptyState emoji="📦" title="대여 내역이 없어요" />
        ) : (
          rentalHistory.map((h) => (
            <Card key={h.id}>
              <div className="rh-row">
                <div className="rh-row__info">
                  <div className="rh-row__head">
                    <Badge tone={h.role === '빌림' ? 'info' : 'primary'}>{h.role}</Badge>
                    <span className="rh-row__title">{h.title}</span>
                  </div>
                  <p className="rh-row__sub">
                    {h.counterpart} · {h.period}
                  </p>
                </div>
                <Badge tone={h.status === '대여중' ? 'warning' : 'success'}>{h.status}</Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
