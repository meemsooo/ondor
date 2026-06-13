import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button, Badge, EmptyState } from '../../components/common';
import { pokeCategories, receivedPokes } from '../../data';
import { PATHS } from '../../routes/paths';
import '../../styles/form.css';
import './PokeSendPage.css';

// 동 선택 예시 (더미)
const BUILDINGS = [1, 2, 3, 4, 5];

export default function PokeSendPage() {
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null); // 동
  const [room, setRoom] = useState(''); // 호실 (직접 입력)
  const [categoryId, setCategoryId] = useState(null);
  const [sent, setSent] = useState(false);

  const selectedCategory = pokeCategories.find((c) => c.id === categoryId);
  const canSend = building !== null && room.trim() !== '' && categoryId !== null;

  // 안 읽은 알림 개수 → 헤더 '받은 알림' 버튼에 표시
  const unreadCount = receivedPokes.filter((p) => !p.isRead).length;
  const receivedButton = (
    <button
      className="app-header__icon-btn"
      onClick={() => navigate(PATHS.POKE_RECEIVED)}
      aria-label="받은 알림"
    >
      🔔
      {unreadCount > 0 && <Badge tone="danger">{unreadCount}</Badge>}
    </button>
  );

  const handleSend = () => {
    if (!canSend) return;
    setSent(true); // 더미: 실제 저장 없이 완료 상태만 표시
  };

  if (sent) {
    return (
      <>
        <Header title="콕 찌르기" back />
        <EmptyState
          emoji="✅"
          title="익명으로 전송되었어요"
          description={`${building}동 ${room}호에 정중한 메시지를 전했어요.`}
        />
        <div className="page">
          <Button block onClick={() => navigate(PATHS.HOME)}>
            홈으로
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="콕 찌르기" back right={receivedButton} />

      <div className="form page">
        {/* 받은 찌르기 알림 배너 (안 읽은 게 있을 때만) */}
        {unreadCount > 0 && (
          <Card
            onClick={() => navigate(PATHS.POKE_RECEIVED)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--color-primary-bg)',
              border: '1px solid var(--color-primary-soft)',
            }}
          >
            <span style={{ fontSize: 'var(--text-h3)' }}>👉</span>
            <span
              style={{
                flex: 1,
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--color-text)',
              }}
            >
              받은 콕 찌르기가 {unreadCount}개 있어요
            </span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>›</span>
          </Card>
        )}

        {/* 받는 대상 */}
        <div className="form-field">
          <label className="form-label">동</label>
          <div className="chip-group">
            {BUILDINGS.map((b) => (
              <button
                type="button"
                key={b}
                className={`chip ${building === b ? 'is-selected' : ''}`}
                onClick={() => setBuilding(b)}
              >
                {b}동
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">호실</label>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            placeholder="예) 302"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        {/* 카테고리 선택 */}
        <div className="form-field">
          <label className="form-label">어떤 점을 알려드릴까요?</label>
          <div className="poke-cats">
            {pokeCategories.map((c) => (
              <Card
                key={c.id}
                className={`poke-cat ${categoryId === c.id ? 'is-selected' : ''}`}
                onClick={() => setCategoryId(c.id)}
              >
                <span className="poke-cat__emoji">{c.emoji}</span>
                <span className="poke-cat__label">{c.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* 메시지 미리보기 */}
        {selectedCategory && (
          <Card className="poke-preview" padded>
            <p className="poke-preview__label">전송될 메시지</p>
            <p className="poke-preview__msg">“{selectedCategory.message}”</p>
            <p className="poke-preview__note">🔒 이 메시지가 익명으로 전송됩니다.</p>
          </Card>
        )}

        <Button size="lg" block disabled={!canSend} onClick={handleSend}>
          익명으로 보내기
        </Button>
      </div>
    </>
  );
}
