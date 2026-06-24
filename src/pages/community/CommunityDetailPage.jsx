import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button, EmptyState } from '../../components/common';
import { getById, getBoard, remove } from '../../services/communityService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { isMine } from '../../services/storage';
import { formatRelativeTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './CommunityDetailPage.css';

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useLiveQuery(() => getById(id));

  if (!post) {
    return (
      <>
        <Header title="게시글" back showChat />
        <div className="page">
          <EmptyState
            emoji="💬"
            title="게시글을 찾을 수 없어요"
            description="삭제되었거나 잘못된 주소예요."
            action={<Button onClick={() => navigate(PATHS.COMMUNITY)}>목록으로</Button>}
          />
        </div>
      </>
    );
  }

  const board = getBoard(post.boardId);
  const mine = isMine(post);

  const handleDelete = () => {
    if (!window.confirm('이 게시글을 삭제할까요?')) return;
    remove(id);
    alert('삭제되었어요.');
    navigate(PATHS.COMMUNITY, { replace: true });
  };

  return (
    <>
      <Header title="게시글" back showChat />
      <div className="page stack">
        <div>
          <Badge tone="muted">{board?.emoji} {board?.label}</Badge>
          <h2 className="cm-detail__title">{post.title}</h2>
          <div className="cm-detail__byline">
            <Avatar emoji="🧑" size="sm" />
            <span className="cm-detail__author">{post.authorName}</span>
            <span className="cm-detail__time">· {formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>

        <Card>
          <p className="cm-detail__content">{post.content}</p>
        </Card>

        {mine ? (
          <div className="form-actions">
            <Button variant="outline" onClick={() => navigate(to.communityEdit(id))}>수정</Button>
            <Button variant="outline" onClick={handleDelete}>삭제</Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
