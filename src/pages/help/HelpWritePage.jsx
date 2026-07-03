import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common'; // 공통 헤더 컴포넌트 경로 확인 필요
import { helpRequests, helpCategories } from '../../data'; // 👈 데이터 파일 경로가 맞는지 확인해 주세요!
import { PATHS } from '../../routes/paths';

export default function HelpWritePage() {
  const navigate = useNavigate();

  // 1️⃣ 사용자가 입력할 값을 담을 바구니 (작성해주신 상태값들)
  const [categoryId, setCategoryId] = useState('bug'); 
  const [title, setTitle] = useState('');              
  const [content, setContent] = useState('');          
  const [location, setLocation] = useState('');        // 📍 새로 추가된 위치
  const [reward, setReward] = useState('');            // 🎁 새로 추가된 보상

  // 2️⃣ [등록 완료] 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 버튼 눌렀을 때 페이지가 새로고침되는 것을 막아줍니다.

    // 유효성 검사: 필수 항목이 비어있으면 경고창을 띄우고 중단합니다.
    if (!title.trim() || !content.trim() || !location.trim()) {
      alert('제목, 내용, 위치는 필수 입력 항목입니다!');
      return;
    }

    // 사용자가 입력한 진짜 데이터들을 하나의 묶음(객체)으로 만듭니다.
    const newRequest = {
      id: Date.now(),             // 시간 데이터로 고유한 ID 생성
      categoryId: categoryId,     // 선택한 카테고리 id ('bug', 'move', 'etc')
      status: 'waiting',          // 처음 등록할 때는 무조건 '대기중'
      title: title.trim(),
      content: content.trim(),
      location: location.trim(),
      reward: reward.trim() || '따뜻한 감사 인사', // 비어있으면 기본값 처리
      createdAt: '방금 전',        // 작성 시간 표시용
    };

    // ⭐ 핵심: 비어있는 helpRequests 배열의 맨 앞에 이 진짜 데이터를 집어넣습니다.
    helpRequests.unshift(newRequest);

    alert('도움 요청이 등록되었습니다!');
    navigate(PATHS.HELP); // 등록 완료 후 도움 목록 페이지로 이동합니다.
  };

  return (
    <>
      {/* 상단 헤더 영역 */}
      <Header title="도움 요청하기" showBack onClickBack={() => navigate(-1)} />
      
      <div className="page stack" style={{ padding: '20px' }}>
        {/* 3️⃣ HTML 입력창들과 useState 바구니 연결하기 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 카테고리 선택 (Dropdown) */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>어떤 도움이 필요하세요?</label>
            <div className="help-quick" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {helpCategories.map((c) => {
                const isActive = categoryId === c.id;
                return (
                  <button 
                    key={c.id} 
                    type="button" // form 안에서 새로고침 방지
                    className={`help-quick__item ${isActive ? 'active' : ''}`}
                    onClick={() => setCategoryId(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: isActive ? '2px solid #FF8A4C' : '1px solid #eee',
                      backgroundColor: isActive ? '#FFEFE6' : '#fff',
                      color: isActive ? '#FF8A4C' : '#333',
                      fontWeight: isActive ? 'bold' : 'normal',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap' // 글자 잘림 방지 및 가로 스크롤 활성화
                    }}
                  >
                    <span className="help-quick__emoji">{c.emoji}</span>
                    <span className="help-quick__label">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 제목 입력창 */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>제목</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="무엇을 도와드릴까요?"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {/* 📍 위치 입력창 */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📍 위치 입력</label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 수원대 고운학사 2층"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {/* 🎁 보상 입력창 */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🎁 보상 / 사례</label>
            <input 
              type="text"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="예: 시원한 아메리카노 한 잔"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {/* 상세 내용 입력창 */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>상세 내용</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상황을 자세히 적어주시면 매칭이 더 잘 돼요."
              rows={5}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'none' }}
            />
          </div>

          {/* 등록 버튼 */}
          <button 
            type="submit" 
            style={{ 
              width: '100%', padding: '14px', borderRadius: '8px', background: '#FF6B6B', 
              color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            등록 완료
          </button>
        </form>
      </div>
    </>
  );
}