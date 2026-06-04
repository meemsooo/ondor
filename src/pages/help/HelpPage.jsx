import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, SegmentedTabs, EmptyState, FAB } from '../../components/common';
import { helpRequests, helpCategories, helpStatusMeta } from '../../data';
import { PATHS, to } from '../../routes/paths';
import './HelpPage.css';

const filterTabs = [
  { id: 'all', label: '전체' },
  ...helpCategories.map((c) => ({ id: c.id, label: c.label })),
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const list = helpRequests.filter((h) => tab === 'all' || h.categoryId === tab);

  return (
    <>
      <Header title="도움 요청" showChat />
      <SegmentedTabs tabs={filterTabs} value={tab} onChange={setTab} />

      {/* 빠른 카테고리 */}
      <div className="help-quick page">
        {helpCategories.map((c) => (
          <button key={c.id} className="help-quick__item" onClick={() => navigate(PATHS.HELP_WRITE)}>
            <span className="help-quick__emoji">{c.emoji}</span>
            <span className="help-quick__label">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="page stack" style={{ paddingTop: 0 }}>
        {list.length === 0 ? (
          <EmptyState emoji="🙋" title="해당 도움 요청이 없어요" description="첫 요청을 남겨보세요!" />
        ) : (
          list.map((h) => {
            const cat = helpCategories.find((c) => c.id === h.categoryId);
            return (
              <Card key={h.id} onClick={() => navigate(to.helpMatching(h.id))}>
                <div className="help-card__top">
                  <span className="help-card__cat">
                    {cat?.emoji} {cat?.label}
                  </span>
                  <Badge tone={helpStatusMeta[h.status].tone}>
                    {helpStatusMeta[h.status].label}
                  </Badge>
                </div>
                <p className="help-card__title">{h.title}</p>
                <p className="help-card__content line-clamp-2">{h.content}</p>
                <div className="help-card__meta">
                  <span>📍 {h.location}</span>
                  <span>🎁 {h.reward}</span>
                  <span className="help-card__time">{h.createdAt}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FAB label="도움 요청" onClick={() => navigate(PATHS.HELP_WRITE)} />
    </>
  );
}
