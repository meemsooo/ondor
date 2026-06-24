import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button, EmptyState } from '../../components/common';
import { getById, getRentalType, remove } from '../../services/rentalService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { isMine } from '../../services/storage';
import { formatWon, formatRelativeTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './RentalDetailPage.css';

export default function RentalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = useLiveQuery(() => getById(id));

  if (!r) {
    return (
      <>
        <Header title="대여 물품 상세" back showChat />
        <div className="page">
          <EmptyState
            emoji="📦"
            title="게시글을 찾을 수 없어요"
            description="삭제되었거나 잘못된 주소예요."
            action={<Button onClick={() => navigate(PATHS.RENTAL)}>목록으로</Button>}
          />
        </div>
      </>
    );
  }

  const meta = getRentalType(r.rentalType);
  const mine = isMine(r);
  const price = Number(r.priceRange) ? formatWon(r.priceRange) : '무료';

  const handleDelete = () => {
    if (!window.confirm('이 대여 물품을 삭제할까요?')) return;
    remove(id);
    alert('삭제되었어요.');
    navigate(PATHS.RENTAL, { replace: true });
  };

  const rows = [
    ['💰 가격대', price],
    ['⏳ 대여 가능 기간', r.rentalPeriod],
    ['📅 반납 예정일', r.returnDate],
    ['📍 만남 장소', r.location],
    ['⚠️ 주의사항', r.caution],
  ].filter(([, v]) => v);

  return (
    <>
      <Header title="대여 물품 상세" back showChat />
      <div className="page stack">
        <div>
          <Badge tone={meta?.tone ?? 'muted'}>{meta?.label}</Badge>
          <h2 className="rental-detail__title">{r.itemName}</h2>
          <p className="rental-detail__time">{formatRelativeTime(r.createdAt)}</p>
        </div>

        <Card>
          {rows.map(([k, v]) => (
            <div key={k} className="rental-detail__row"><span>{k}</span><span>{v}</span></div>
          ))}
        </Card>

        {r.description ? (
          <Card>
            <p className="rental-detail__section">상세 설명</p>
            <p className="rental-detail__desc">{r.description}</p>
          </Card>
        ) : null}

        <Card>
          <div className="rental-detail__author">
            <Avatar emoji="🧑" size="md" />
            <div>
              <p className="rental-detail__author-name">{r.authorName}</p>
              <p className="rental-detail__author-sub">작성자</p>
            </div>
          </div>
        </Card>

        {mine ? (
          <div className="form-actions">
            <Button variant="outline" onClick={() => navigate(to.rentalEdit(id))}>수정</Button>
            <Button variant="outline" onClick={handleDelete}>삭제</Button>
          </div>
        ) : (
          <Button size="lg" block onClick={() => navigate(PATHS.CHAT)}>채팅하기</Button>
        )}
      </div>
    </>
  );
}
