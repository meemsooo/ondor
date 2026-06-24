import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB, Button } from '../../components/common';
import { getAll, COMMUNITY_BOARDS, getBoard } from '../../services/communityService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { formatRelativeTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './CommunityPage.css';

const tabs = [{ id: 'all', label: '전체' }, ...COMMUNITY_BOARDS.map((b) => ({ id: b.id, label: b.label }))];

export default function CommunityPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const all = useLiveQuery(getAll);
  const list = all.filter((p) => tab === 'all' || p.boardId === tab);

  return (
    <>
      <Header title="커뮤니티" showChat />
      <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="page stack">
        {all.length === 0 ? (
          <EmptyState
            emoji="💬"
            title="아직 작성된 게시글이 없어요"
            description="첫 글을 작성해보세요!"
            action={<Button onClick={() => navigate(PATHS.COMMUNITY_NEW)}>글쓰기</Button>}
          />
        ) : list.length === 0 ? (
          <EmptyState emoji="💬" title="해당 게시판에 글이 없어요" />
        ) : (
          list.map((p) => {
            const board = getBoard(p.boardId);
            return (
              <Card key={p.id} onClick={() => navigate(to.communityDetail(p.id))}>
                <div className="cm-post__head">
                  <Badge tone="muted">
                    {board?.emoji} {board?.label}
                  </Badge>
                  <span className="cm-post__time">{formatRelativeTime(p.createdAt)}</span>
                </div>
                <p className="cm-post__title">{p.title}</p>
                <p className="cm-post__content line-clamp-2">{p.content}</p>
                <div className="cm-post__meta">
                  <span>🧑 {p.authorName}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FAB label="글쓰기" onClick={() => navigate(PATHS.COMMUNITY_NEW)} />
    </>
  );
}
