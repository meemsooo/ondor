import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Card, EmptyState } from '../../components/common';
import { fetchNoticeDetail } from '../../services/noticeService';
import './NoticeDetailPage.css';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotice = async () => {
      try {
        setLoading(true);
        const data = await fetchNoticeDetail(id);
        setNotice(data);
        setError(null);
      } catch (err) {
        setError(err.message || '공지사항을 불러오지 못했습니다');
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    loadNotice();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Header title="공지사항" back showChat />
        <div className="page">
          <EmptyState emoji="⏳" title="로딩 중..." />
        </div>
      </>
    );
  }

  if (error || !notice) {
    return (
      <>
        <Header title="공지사항" back showChat />
        <div className="page">
          <EmptyState emoji="❌" title="공지사항을 불러올 수 없습니다" description={error} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="공지사항" back showChat />

      <div className="notice-detail">
        <div className="page stack">
          {/* 제목 */}
          <div>
            <h1 className="notice-detail__title">{notice.title}</h1>

            {/* 메타 정보 */}
            <Card className="notice-detail__meta">
              <div className="notice-detail__meta-item">
                <span className="notice-detail__meta-label">글쓴이</span>
                <span className="notice-detail__meta-value">{notice.author || notice.source}</span>
              </div>
              <div className="notice-detail__meta-item">
                <span className="notice-detail__meta-label">작성일</span>
                <span className="notice-detail__meta-value">{formatDate(notice.date)}</span>
              </div>
              <div className="notice-detail__meta-item">
                <span className="notice-detail__meta-label">조회수</span>
                <span className="notice-detail__meta-value">{notice.views || 0}</span>
              </div>
            </Card>
          </div>

          {/* 본문 */}
          <Card className="notice-detail__content">
            <div className="notice-detail__text">
              {notice.content ? (
                notice.content.split('\n').map((line, idx) => (
                  <p key={idx}>{line || '\u00A0'}</p>
                ))
              ) : (
                <p className="notice-detail__text--muted">이 공지의 상세 내용은 학교 원문에서 확인해주세요.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="notice-detail__action">
        <button
          className="notice-detail__btn"
          onClick={() => window.open(notice.link, '_blank')}
        >
          학교 원문 보기
        </button>
      </div>
    </>
  );
}
