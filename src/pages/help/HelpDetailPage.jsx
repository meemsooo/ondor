import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button, EmptyState } from '../../components/common';
import { getById, getHelpType, remove } from '../../services/helpRequestService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { isMine } from '../../services/storage';
import { formatRelativeTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './HelpDetailPage.css';

export default function HelpDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const help = useLiveQuery(() => getById(id));

  if (!help) {
    return (
      <>
        <Header title="도움요청 상세" back showChat />
        <div className="page">
          <EmptyState
            emoji="🙋"
            title="게시글을 찾을 수 없어요"
            description="삭제되었거나 잘못된 주소예요."
            action={<Button onClick={() => navigate(PATHS.HELP)}>목록으로</Button>}
          />
        </div>
      </>
    );
  }

  const cat = getHelpType(help.typeId);
  const mine = isMine(help);

  const handleDelete = () => {
    if (!window.confirm('이 도움요청을 삭제할까요?')) return;
    remove(id);
    alert('삭제되었어요.');
    navigate(PATHS.HELP, { replace: true });
  };

  const bugRows = [
    ['종류', help.bugKind],
    ['크기', help.bugSize],
    ['수', help.bugCount],
    ['움직임', help.bugMovement],
    ['가둠 여부', help.bugContained],
  ].filter(([, v]) => v);

  const moveRows = [
    ['짐 종류', help.cargoKind],
    ['예상 무게', help.cargoWeight],
    ['이동 거리', help.cargoDistance],
    ['출발 위치', help.fromLocation],
    ['도착 위치', help.toLocation],
  ].filter(([, v]) => v);

  return (
    <>
      <Header title="도움요청 상세" back showChat />
      <div className="page stack">
        <div>
          <Badge tone="muted">{cat?.emoji} {cat?.label}</Badge>
          <h2 className="help-detail__title">{help.title}</h2>
          <p className="help-detail__time">{formatRelativeTime(help.createdAt)}</p>
        </div>

        <Card>
          {help.location ? (
            <div className="help-detail__row"><span>📍 위치</span><span>{help.location}</span></div>
          ) : null}
          {help.peopleNeeded ? (
            <div className="help-detail__row"><span>👥 필요 인원</span><span>{help.peopleNeeded}명</span></div>
          ) : null}
          {help.preferredTime ? (
            <div className="help-detail__row"><span>🕒 희망 시간</span><span>{help.preferredTime}</span></div>
          ) : null}
        </Card>

        {bugRows.length > 0 ? (
          <Card>
            <p className="help-detail__section">🐛 벌레 정보</p>
            {bugRows.map(([k, v]) => (
              <div key={k} className="help-detail__row"><span>{k}</span><span>{v}</span></div>
            ))}
          </Card>
        ) : null}

        {moveRows.length > 0 ? (
          <Card>
            <p className="help-detail__section">📦 짐 정보</p>
            {moveRows.map(([k, v]) => (
              <div key={k} className="help-detail__row"><span>{k}</span><span>{v}</span></div>
            ))}
          </Card>
        ) : null}

        {help.description ? (
          <Card>
            <p className="help-detail__section">상세 설명</p>
            <p className="help-detail__desc">{help.description}</p>
          </Card>
        ) : null}

        <Card>
          <div className="help-detail__author">
            <Avatar emoji="🧑" size="md" />
            <div>
              <p className="help-detail__author-name">{help.authorName}</p>
              <p className="help-detail__author-sub">작성자</p>
            </div>
          </div>
        </Card>

        {mine ? (
          <div className="form-actions">
            <Button variant="outline" onClick={() => navigate(to.helpEdit(id))}>수정</Button>
            <Button variant="outline" onClick={handleDelete}>삭제</Button>
          </div>
        ) : (
          <Button size="lg" block onClick={() => navigate(PATHS.CHAT)}>도와줄게요 (채팅)</Button>
        )}
      </div>
    </>
  );
}
