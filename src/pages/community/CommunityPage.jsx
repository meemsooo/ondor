import { useState } from 'react';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB } from '../../components/common';
import { communityPosts, communityBoards } from '../../data';
import './CommunityPage.css';

const tabs = [{ id: 'all', label: '전체' }, ...communityBoards.map((b) => ({ id: b.id, label: b.label }))];

export default function CommunityPage() {
  const [tab, setTab] = useState('all');

  const list = communityPosts
    .filter((p) => tab === 'all' || p.boardId === tab)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <>
      <Header title="커뮤니티" showChat />
      <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="page stack">
        {list.length === 0 ? (
          <EmptyState emoji="💬" title="아직 게시글이 없어요" description="첫 글을 작성해보세요!" />
        ) : (
          list.map((p) => {
            const board = communityBoards.find((b) => b.id === p.boardId);
            return (
              <Card key={p.id} onClick={() => alert(`${p.title} (더미)`)}>
                <div className="cm-post__head">
                  {p.pinned ? <Badge tone="danger">📌 고정</Badge> : null}
                  <Badge tone="muted">
                    {board?.emoji} {board?.label}
                  </Badge>
                  <span className="cm-post__time">{p.createdAt}</span>
                </div>
                <p className="cm-post__title">{p.title}</p>
                <p className="cm-post__content line-clamp-2">{p.content}</p>
                <div className="cm-post__meta">
                  <span>🧑 {p.author}</span>
                  <span>♥ {p.likes}</span>
                  <span>💬 {p.comments}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FAB label="글쓰기" onClick={() => alert('게시글 작성 (더미)')} />
    </>
  );
}
