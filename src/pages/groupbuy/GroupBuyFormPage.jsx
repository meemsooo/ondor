import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Button, Avatar } from '../../components/common';
import {
  GROUP_BUY_CATEGORIES,
  getById,
  create,
  update,
} from '../../services/groupBuyService';
import { currentUser } from '../../config/currentUser';
import { to } from '../../routes/paths';
import '../../styles/form.css';

const EMPTY = {
  title: '',
  category: '',
  productName: '',
  productDesc: '',
  totalPrice: '',
  targetCount: '',
  deadline: '',
  location: '',
  pickupTime: '',
  caution: '',
  image: '',
};

export default function GroupBuyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const existing = editing ? getById(id) : null;
  const [form, setForm] = useState(() => (existing ? { ...EMPTY, ...existing } : EMPTY));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = '제목을 입력해주세요.';
    if (!form.category) next.category = '카테고리를 선택해주세요.';
    if (!form.productName.trim()) next.productName = '상품명을 입력해주세요.';
    if (!String(form.totalPrice).trim() || Number(form.totalPrice) <= 0)
      next.totalPrice = '전체 금액을 입력해주세요.';
    if (!String(form.targetCount).trim() || Number(form.targetCount) < 2)
      next.targetCount = '목표 인원을 2명 이상 입력해주세요.';
    if (!form.deadline) next.deadline = '모집 마감 일시를 선택해주세요.';
    if (!form.location.trim()) next.location = '수령/만남 장소를 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      category: form.category,
      productName: form.productName.trim(),
      productDesc: form.productDesc.trim(),
      totalPrice: Number(form.totalPrice),
      targetCount: Number(form.targetCount),
      deadline: form.deadline,
      location: form.location.trim(),
      pickupTime: form.pickupTime.trim(),
      caution: form.caution.trim(),
      image: form.image,
    };

    const saved = editing ? update(id, payload) : create(payload);
    alert(editing ? '공동구매가 수정되었어요!' : '공동구매가 등록되었어요!');
    navigate(to.groupBuyDetail(saved.id), { replace: true });
  };

  if (editing && !existing) {
    return (
      <>
        <Header title="공동구매 수정" back />
        <div className="page">
          <p>게시글을 찾을 수 없어요.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={editing ? '공동구매 수정' : '공동구매 만들기'} back />
      <form className="form page" onSubmit={handleSubmit} noValidate>
        {/* 작성자 프로필 */}
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

        {/* 카테고리 */}
        <div className="form-field">
          <label className="form-label">
            카테고리<span className="form-required">*</span>
          </label>
          <div className="chip-group">
            {GROUP_BUY_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip ${form.category === c.id ? 'is-selected' : ''}`}
                onClick={() => setForm((f) => ({ ...f, category: c.id }))}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          {errors.category ? <p className="form-error">{errors.category}</p> : null}
        </div>

        {/* 제목 */}
        <div className="form-field">
          <label className="form-label">
            제목<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.title ? 'is-error' : ''}`}
            placeholder="예) 생수 2L 12개입 같이 사요"
            value={form.title}
            onChange={set('title')}
          />
          {errors.title ? <p className="form-error">{errors.title}</p> : null}
        </div>

        {/* 상품명 */}
        <div className="form-field">
          <label className="form-label">
            상품명<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.productName ? 'is-error' : ''}`}
            placeholder="예) 삼다수 2L 12병"
            value={form.productName}
            onChange={set('productName')}
          />
          {errors.productName ? <p className="form-error">{errors.productName}</p> : null}
        </div>

        {/* 상품 설명 */}
        <div className="form-field">
          <label className="form-label">상품 설명</label>
          <textarea
            className="form-textarea"
            placeholder="상품 정보, 링크, 옵션 등을 적어주세요"
            value={form.productDesc}
            onChange={set('productDesc')}
          />
        </div>

        {/* 금액 / 인원 */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">
              전체 금액(원)<span className="form-required">*</span>
            </label>
            <input
              className={`form-input ${errors.totalPrice ? 'is-error' : ''}`}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="8900"
              value={form.totalPrice}
              onChange={set('totalPrice')}
            />
            {errors.totalPrice ? <p className="form-error">{errors.totalPrice}</p> : null}
          </div>
          <div className="form-field">
            <label className="form-label">
              목표 인원<span className="form-required">*</span>
            </label>
            <input
              className={`form-input ${errors.targetCount ? 'is-error' : ''}`}
              type="number"
              inputMode="numeric"
              min="2"
              placeholder="4"
              value={form.targetCount}
              onChange={set('targetCount')}
            />
            {errors.targetCount ? <p className="form-error">{errors.targetCount}</p> : null}
          </div>
        </div>

        {/* 마감 일시 */}
        <div className="form-field">
          <label className="form-label">
            모집 마감 일시<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.deadline ? 'is-error' : ''}`}
            type="datetime-local"
            value={form.deadline}
            onChange={set('deadline')}
          />
          {errors.deadline ? <p className="form-error">{errors.deadline}</p> : null}
        </div>

        {/* 장소 */}
        <div className="form-field">
          <label className="form-label">
            수령 / 만남 장소<span className="form-required">*</span>
          </label>
          <input
            className={`form-input ${errors.location ? 'is-error' : ''}`}
            placeholder="예) 행복기숙사 3동 1층 로비"
            value={form.location}
            onChange={set('location')}
          />
          {errors.location ? <p className="form-error">{errors.location}</p> : null}
        </div>

        {/* 수령 예정 시간 */}
        <div className="form-field">
          <label className="form-label">수령 예정 시간</label>
          <input
            className="form-input"
            placeholder="예) 6/25 저녁 7시"
            value={form.pickupTime}
            onChange={set('pickupTime')}
          />
        </div>

        {/* 주의사항 */}
        <div className="form-field">
          <label className="form-label">참여 시 주의사항</label>
          <textarea
            className="form-textarea"
            placeholder="예) 입금 후 채팅으로 알려주세요"
            value={form.caution}
            onChange={set('caution')}
          />
        </div>

        {/* 이미지 */}
        <div className="form-field">
          <label className="form-label">이미지 (선택)</label>
          <label className="form-image">
            {form.image ? (
              <>
                <img src={form.image} alt="미리보기" />
                <button
                  type="button"
                  className="form-image__remove"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm((f) => ({ ...f, image: '' }));
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <span className="form-image__placeholder">
                <span>📷</span>
                <span>이미지 첨부하기</span>
              </span>
            )}
            <input type="file" accept="image/*" hidden onChange={handleImage} />
          </label>
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
