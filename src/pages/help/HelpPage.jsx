import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, SegmentedTabs, EmptyState, FAB, Button } from '../../components/common';
import { getAll, HELP_TYPES, getHelpType } from '../../services/helpRequestService';
import { useLiveQuery } from '../../hooks/useLiveQuery';
import { formatRelativeTime } from '../../utils/format';
import { PATHS, to } from '../../routes/paths';
import './HelpPage.css';

const filterTabs = [
  { id: 'all', label: '전체' },
  ...HELP_TYPES.map((c) => ({ id: c.id, label: c.label })),
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const all = useLiveQuery(getAll);
  const list = all.filter((h) => tab === 'all' || h.typeId === tab);

  return (
    <>
      <Header title="도움 요청" showChat />
      <SegmentedTabs tabs={filterTabs} value={tab} onChange={setTab} />

      <div className="page stack">
        {all.length === 0 ? (
          <EmptyState
            emoji="🙋"
            title="아직 등록된 도움요청이 없어요"
            description="첫 도움요청을 남겨보세요!"
            action={<Button onClick={() => navigate(PATHS.HELP_NEW)}>도움요청 작성</Button>}
          />
        ) : list.length === 0 ? (
          <EmptyState emoji="🙋" title="해당 도움 요청이 없어요" />
        ) : (
          list.map((h) => {
            const cat = getHelpType(h.typeId);
            return (
              <Card key={h.id} onClick={() => navigate(to.helpDetail(h.id))}>
                <div className="help-card__top">
                  <span className="help-card__cat">
                    {cat?.emoji} {cat?.label}
                  </span>
                  <span className="help-card__time">{formatRelativeTime(h.createdAt)}</span>
                </div>
                <p className="help-card__title">{h.title}</p>
                {h.description ? (
                  <p className="help-card__content line-clamp-2">{h.description}</p>
                ) : null}
                <div className="help-card__meta">
                  {h.location ? <span>📍 {h.location}</span> : null}
                  {h.peopleNeeded ? <span>👥 {h.peopleNeeded}명</span> : null}
                  {h.preferredTime ? <span>🕒 {h.preferredTime}</span> : null}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <FAB label="도움 요청" onClick={() => navigate(PATHS.HELP_NEW)} />
    </>
  );
}
