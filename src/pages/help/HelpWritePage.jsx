import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../../components/common';
import { helpCategories } from '../../data';
import { PATHS } from '../../routes/paths';
import '../../styles/form.css';

export default function HelpWritePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(helpCategories[0].id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reward, setReward] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // MVP: 더미 동작 — 실제 저장 없이 목록으로 이동
    alert('도움 요청이 등록되었어요! (더미)');
    navigate(PATHS.HELP);
  };

  return (
    <>
      <Header title="도움 요청 작성" back />
      <form className="form page" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">어떤 도움이 필요하세요?</label>
          <div className="chip-group">
            {helpCategories.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip ${category === c.id ? 'is-selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">제목</label>
          <input
            className="form-input"
            placeholder="예) 방에 벌레가 나왔어요 ㅠㅠ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">상세 내용</label>
          <textarea
            className="form-textarea"
            placeholder="상황을 자세히 적어주시면 더 빨리 매칭돼요!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">사례 (선택)</label>
          <input
            className="form-input"
            placeholder="예) 음료수 한 잔, 5,000원"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" block>
          도움 요청 등록하기
        </Button>
      </form>
    </>
  );
}
