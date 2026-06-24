import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Button } from '../../components/common';
import { COMMUNITY_BOARDS, getById, create, update } from '../../services/communityService';
import { to } from '../../routes/paths';
import '../../styles/form.css';

const EMPTY = { boardId: '', title: '', content: '' };

export default function CommunityFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const existing = editing ? getById(id) : null;
  const [form, setForm] = useState(() => (existing ? { ...EMPTY, ...existing } : EMPTY));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.boardId) next.boardId = '게시판을 선택해주세요.';
    if (!form.title.trim()) next.title = '제목을 입력해주세요.';
    if (!form.content.trim()) next.content = '내용을 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { boardId: form.boardId, title: form.title.trim(), content: form.content.trim() };
    const saved = editing ? update(id, payload) : create(payload);
    alert(editing ? '게시글이 수정되었어요!' : '게시글이 등록되었어요!');
    navigate(to.communityDetail(saved.id), { replace: true });
  };

  if (editing && !existing) {
    return (
      <>
        <Header title="게시글 수정" back />
        <div className="page">
          <p>게시글을 찾을 수 없어요.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={editing ? '게시글 수정' : '글쓰기'} back />
      <form className="form page" onSubmit={handleSubmit} noValidate>
        {/* 게시판 */}
        <div className="form-field">
          <label className="form-label">
            게시판<span className="form-required">*</span>
          </label>
          <div className="chip-group">
            {COMMUNITY_BOARDS.map((b) => (
              <button
                type="button"
                key={b.id}
                className={`chip ${form.boardId === b.id ? 'is-selected' : ''}`}
                onClick={() => setForm((f) => ({ ...f, boardId: b.id }))}
              >
                {b.emoji} {b.label}
              </button>
            ))}
          </div>
          {errors.boardId ? <p className="form-error">{errors.boardId}</p> : null}
        </div>

        {/* 제목 */}
        <div className="form-field">
          <label className="form-label">
            제목<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.title ? 'is-error' : ''}`}
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={set('title')}
          />
          {errors.title ? <p className="form-error">{errors.title}</p> : null}
        </div>

        {/* 내용 */}
        <div className="form-field">
          <label className="form-label">
            내용<span className="form-required">*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.content ? 'is-error' : ''}`}
            style={{ minHeight: 200 }}
            placeholder="내용을 입력하세요"
            value={form.content}
            onChange={set('content')}
          />
          {errors.content ? <p className="form-error">{errors.content}</p> : null}
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
