import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button, EmptyState } from '../../components/common';
import { pokeCategories } from '../../data';
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
      <Header title="콕 찌르기" back />

      <div className="form page">
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
