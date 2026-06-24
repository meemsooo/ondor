import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Button, Avatar } from '../../components/common';
import { HELP_TYPES, getById, create, update } from '../../services/helpRequestService';
import { currentUser } from '../../config/currentUser';
import { to } from '../../routes/paths';
import '../../styles/form.css';

const EMPTY = {
  typeId: '',
  title: '',
  location: '',
  peopleNeeded: '',
  preferredTime: '',
  description: '',
  // 벌레 잡기
  bugKind: '',
  bugSize: '',
  bugCount: '',
  bugMovement: '',
  bugContained: '',
  // 무거운 짐 옮기기
  cargoKind: '',
  cargoWeight: '',
  cargoDistance: '',
  fromLocation: '',
  toLocation: '',
};

export default function HelpFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const existing = editing ? getById(id) : null;
  const [form, setForm] = useState(() => (existing ? { ...EMPTY, ...existing } : EMPTY));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.typeId) next.typeId = '도움 유형을 선택해주세요.';
    if (!form.title.trim()) next.title = '제목을 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const saved = editing ? update(id, form) : create(form);
    alert(editing ? '도움요청이 수정되었어요!' : '도움요청이 등록되었어요!');
    navigate(to.helpDetail(saved.id), { replace: true });
  };

  if (editing && !existing) {
    return (
      <>
        <Header title="도움요청 수정" back />
        <div className="page">
          <p>게시글을 찾을 수 없어요.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={editing ? '도움요청 수정' : '도움요청 작성'} back />
      <form className="form page" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label">작성자</label>
          <div className="gbf-author">
            <Avatar emoji={currentUser.avatar} size="md" />
            <div>
              <p className="gbf-author__name">{currentUser.name}</p>
              <p className="gbf-author__loc">📍 {currentUser.dormitory}</p>
            </div>
          </div>
        </div>

        {/* 도움 유형 */}
        <div className="form-field">
          <label className="form-label">
            도움 유형<span className="form-required">*</span>
          </label>
          <div className="chip-group">
            {HELP_TYPES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip ${form.typeId === c.id ? 'is-selected' : ''}`}
                onClick={() => setForm((f) => ({ ...f, typeId: c.id }))}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          {errors.typeId ? <p className="form-error">{errors.typeId}</p> : null}
        </div>

        {/* 제목 */}
        <div className="form-field">
          <label className="form-label">
            제목<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.title ? 'is-error' : ''}`}
            placeholder="예) 방에 벌레가 나왔어요 ㅠㅠ"
            value={form.title}
            onChange={set('title')}
          />
          {errors.title ? <p className="form-error">{errors.title}</p> : null}
        </div>

        {/* 위치 / 인원 */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">위치</label>
            <input
              className="form-input"
              placeholder="예) 3동 302호"
              value={form.location}
              onChange={set('location')}
            />
          </div>
          <div className="form-field">
            <label className="form-label">필요 인원</label>
            <input
              className="form-input"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="1"
              value={form.peopleNeeded}
              onChange={set('peopleNeeded')}
            />
          </div>
        </div>

        {/* 희망 시간 */}
        <div className="form-field">
          <label className="form-label">희망 시간</label>
          <input
            className="form-input"
            placeholder="예) 오늘 저녁, 지금 바로"
            value={form.preferredTime}
            onChange={set('preferredTime')}
          />
        </div>

        {/* 벌레 잡기 추가 입력 */}
        {form.typeId === 'bug' ? (
          <div className="form-field">
            <label className="form-label">벌레 정보</label>
            <div className="form-row">
              <div className="form-field">
                <input className="form-input" placeholder="종류 (예: 바퀴벌레)" value={form.bugKind} onChange={set('bugKind')} />
              </div>
              <div className="form-field">
                <input className="form-input" placeholder="크기 (예: 손톱만함)" value={form.bugSize} onChange={set('bugSize')} />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 'var(--space-2)' }}>
              <div className="form-field">
                <input className="form-input" placeholder="수 (예: 1마리)" value={form.bugCount} onChange={set('bugCount')} />
              </div>
              <div className="form-field">
                <input className="form-input" placeholder="움직임 (예: 빠름)" value={form.bugMovement} onChange={set('bugMovement')} />
              </div>
            </div>
            <input
              className="form-input"
              style={{ marginTop: 'var(--space-2)' }}
              placeholder="가둠 여부 (예: 컵으로 덮어둠)"
              value={form.bugContained}
              onChange={set('bugContained')}
            />
          </div>
        ) : null}

        {/* 무거운 짐 옮기기 추가 입력 */}
        {form.typeId === 'move' ? (
          <div className="form-field">
            <label className="form-label">짐 정보</label>
            <div className="form-row">
              <div className="form-field">
                <input className="form-input" placeholder="짐 종류 (예: 생수 박스)" value={form.cargoKind} onChange={set('cargoKind')} />
              </div>
              <div className="form-field">
                <input className="form-input" placeholder="예상 무게 (예: 20kg)" value={form.cargoWeight} onChange={set('cargoWeight')} />
              </div>
            </div>
            <input
              className="form-input"
              style={{ marginTop: 'var(--space-2)' }}
              placeholder="이동 거리 (예: 1층 → 4층)"
              value={form.cargoDistance}
              onChange={set('cargoDistance')}
            />
            <div className="form-row" style={{ marginTop: 'var(--space-2)' }}>
              <div className="form-field">
                <input className="form-input" placeholder="출발 위치" value={form.fromLocation} onChange={set('fromLocation')} />
              </div>
              <div className="form-field">
                <input className="form-input" placeholder="도착 위치" value={form.toLocation} onChange={set('toLocation')} />
              </div>
            </div>
          </div>
        ) : null}

        {/* 상세 설명 */}
        <div className="form-field">
          <label className="form-label">상세 설명</label>
          <textarea
            className="form-textarea"
            placeholder="상황을 자세히 적어주시면 더 빨리 도움받을 수 있어요!"
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" size="lg">
            {editing ? '수정 완료' : '등록하기'}
          </Button>
        </div>
      </form>
    </>
  );
}
