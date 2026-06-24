import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Button, Avatar } from '../../components/common';
import { RENTAL_TYPES, MAX_PRICE, getById, create, update } from '../../services/rentalService';
import { currentUser } from '../../config/currentUser';
import { formatWon } from '../../utils/format';
import { to } from '../../routes/paths';
import '../../styles/form.css';

const EMPTY = {
  rentalType: 'offer',
  itemName: '',
  priceRange: '',
  rentalPeriod: '',
  returnDate: '',
  location: '',
  caution: '',
  description: '',
};

export default function RentalFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const existing = editing ? getById(id) : null;
  const [form, setForm] = useState(() => (existing ? { ...EMPTY, ...existing } : EMPTY));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.rentalType) next.rentalType = '구분을 선택해주세요.';
    if (!form.itemName.trim()) next.itemName = '물건명을 입력해주세요.';
    if (form.priceRange !== '' && Number(form.priceRange) > MAX_PRICE) {
      next.priceRange = `${formatWon(MAX_PRICE)}을 초과하는 물건은 등록할 수 없어요.`;
    }
    if (form.priceRange !== '' && Number(form.priceRange) < 0) {
      next.priceRange = '올바른 금액을 입력해주세요.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      itemName: form.itemName.trim(),
      priceRange: form.priceRange === '' ? 0 : Number(form.priceRange),
    };
    const saved = editing ? update(id, payload) : create(payload);
    alert(editing ? '대여 물품이 수정되었어요!' : '대여 물품이 등록되었어요!');
    navigate(to.rentalDetail(saved.id), { replace: true });
  };

  if (editing && !existing) {
    return (
      <>
        <Header title="대여 물품 수정" back />
        <div className="page">
          <p>게시글을 찾을 수 없어요.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={editing ? '대여 물품 수정' : '물건 등록'} back />
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

        {/* 구분 */}
        <div className="form-field">
          <label className="form-label">
            구분<span className="form-required">*</span>
          </label>
          <div className="chip-group">
            {RENTAL_TYPES.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`chip ${form.rentalType === t.id ? 'is-selected' : ''}`}
                onClick={() => setForm((f) => ({ ...f, rentalType: t.id }))}
              >
                {t.label}
              </button>
            ))}
          </div>
          {errors.rentalType ? <p className="form-error">{errors.rentalType}</p> : null}
        </div>

        {/* 물건명 */}
        <div className="form-field">
          <label className="form-label">
            물건명<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.itemName ? 'is-error' : ''}`}
            placeholder="예) 무선 청소기, 캐리어 28인치"
            value={form.itemName}
            onChange={set('itemName')}
          />
          {errors.itemName ? <p className="form-error">{errors.itemName}</p> : null}
        </div>

        {/* 가격대 */}
        <div className="form-field">
          <label className="form-label">물건 가격대(원)</label>
          <input
            className={`form-input ${errors.priceRange ? 'is-error' : ''}`}
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="비워두면 무료"
            value={form.priceRange}
            onChange={set('priceRange')}
          />
          {errors.priceRange ? (
            <p className="form-error">{errors.priceRange}</p>
          ) : (
            <p className="form-hint">{formatWon(MAX_PRICE)} 이하 물품만 등록할 수 있어요.</p>
          )}
        </div>

        {/* 대여 기간 / 반납 예정일 */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">대여 가능 기간</label>
            <input
              className="form-input"
              placeholder="예) 최대 3일"
              value={form.rentalPeriod}
              onChange={set('rentalPeriod')}
            />
          </div>
          <div className="form-field">
            <label className="form-label">반납 예정일</label>
            <input
              className="form-input"
              type="date"
              value={form.returnDate}
              onChange={set('returnDate')}
            />
          </div>
        </div>

        {/* 만남 장소 */}
        <div className="form-field">
          <label className="form-label">만남 장소</label>
          <input
            className="form-input"
            placeholder="예) 행복기숙사 3동 1층"
            value={form.location}
            onChange={set('location')}
          />
        </div>

        {/* 주의사항 */}
        <div className="form-field">
          <label className="form-label">주의사항</label>
          <textarea
            className="form-textarea"
            placeholder="예) 파손 시 변상, 사용 후 충전해서 반납 등"
            value={form.caution}
            onChange={set('caution')}
          />
        </div>

        {/* 상세 설명 */}
        <div className="form-field">
          <label className="form-label">상세 설명</label>
          <textarea
            className="form-textarea"
            placeholder="물건 상태, 모델명 등을 적어주세요"
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
