import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../../components/common';
import { rentalTypeMeta } from '../../data';
import { PATHS } from '../../routes/paths';
import '../../styles/form.css';

export default function RentalRegisterPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('offer');
  const [title, setTitle] = useState('');
  const [fee, setFee] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('물건이 등록되었어요! (더미)');
    navigate(PATHS.RENTAL);
  };

  return (
    <>
      <Header title="물건 등록" back />
      <form className="form page" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">구분</label>
          <div className="chip-group">
            {Object.entries(rentalTypeMeta).map(([key, meta]) => (
              <button
                type="button"
                key={key}
                className={`chip ${type === key ? 'is-selected' : ''}`}
                onClick={() => setType(key)}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">물건 이름</label>
          <input
            className="form-input"
            placeholder="예) 무선 청소기, 캐리어 28인치"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">대여료</label>
          <input
            className="form-input"
            placeholder="예) 무료, 하루 2,000원"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">설명</label>
          <textarea
            className="form-textarea"
            placeholder="물건 상태, 대여 가능 기간 등을 적어주세요"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" block>
          등록하기
        </Button>
      </form>
    </>
  );
}
