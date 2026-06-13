import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button } from '../../components/common';
import { helpRequests, helpCategories, helpStatusMeta } from '../../data';
import { PATHS } from '../../routes/paths';
import './HelpMatchingPage.css';

// 매칭 진행 단계 (더미)
const steps = [
  { id: 'waiting', label: '요청 등록', emoji: '📝' },
  { id: 'matched', label: '도우미 매칭', emoji: '🤝' },
  { id: 'done', label: '도움 완료', emoji: '✅' },
];

export default function HelpMatchingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const help = helpRequests.find((h) => h.id === id) ?? helpRequests[0];
  const cat = helpCategories.find((c) => c.id === help.categoryId);

  const currentStepIndex = steps.findIndex((s) => s.id === help.status);

  return (
    <>
      <Header title="매칭 상태" back showChat />
      <div className="page stack">
        {/* 요청 요약 */}
        <Card>
          <div className="match-summary__top">
            <span className="match-summary__cat">{cat?.emoji} {cat?.label}</span>
            <Badge tone={helpStatusMeta[help.status].tone}>
              {helpStatusMeta[help.status].label}
            </Badge>
          </div>
          <p className="match-summary__title">{help.title}</p>
          <p className="match-summary__content">{help.content}</p>
          <div className="match-summary__meta">
            📍 {help.location} · 🎁 {help.reward} · {help.createdAt}
          </div>
        </Card>

        {/* 진행 단계 */}
        <Card>
          <div className="match-steps">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`match-step ${i <= currentStepIndex ? 'is-done' : ''} ${
                  i === currentStepIndex ? 'is-current' : ''
                }`}
              >
                <span className="match-step__dot">{s.emoji}</span>
                <span className="match-step__label">{s.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 매칭된 상대 */}
        {help.status !== 'waiting' && help.matchedWith ? (
          <Card>
            <p className="match-helper__label">매칭된 도우미</p>
            <div className="match-helper">
              <Avatar emoji="🐰" size="md" />
              <div className="match-helper__info">
                <p className="match-helper__name">{help.matchedWith}</p>
                <p className="match-helper__sub">곧 도와드리러 갈게요!</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate(PATHS.CHAT)}>
                채팅하기
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="match-waiting">
            <p className="match-waiting__emoji">⏳</p>
            <p className="match-waiting__text">
              도우미를 기다리는 중이에요
              <br />
              <b>지원자 {help.applicants}명</b>
            </p>
          </Card>
        )}

        {help.status === 'waiting' ? (
          <Button size="lg" block onClick={() => navigate(PATHS.HELP)}>
            요청 수정 / 취소
          </Button>
        ) : help.status === 'matched' ? (
          <Button size="lg" block>도움 완료 처리</Button>
        ) : (
          <Button size="lg" block variant="outline" onClick={() => navigate(PATHS.HELP)}>
            목록으로
          </Button>
        )}
      </div>
    </>
  );
}
