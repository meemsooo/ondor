import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, EmptyState } from '../../components/common';
import { fetchDormNotices } from '../../services/noticeService';
import './NoticesPage.css';

export default function NoticesPage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        const data = await fetchDormNotices();
        setNotices(data);
        setError(null);
      } catch (err) {
        setError(err.message || '공지사항을 불러오지 못했습니다');
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  const handleViewOriginal = (link) => {
    window.open(link, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        return `${diffDays}일 전`;
      }
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <>
      <Header title="기숙사 공지사항" back showChat />

      <div className="page stack">
        {loading ? (
          <EmptyState emoji="⏳" title="로딩 중..." />
        ) : error ? (
          <EmptyState emoji="❌" title="공지사항을 불러올 수 없습니다" description={error} />
        ) : notices.length === 0 ? (
          <EmptyState emoji="📢" title="공지사항이 없습니다" description="나중에 다시 확인해주세요." />
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className="notice-card">
              <div className="notice-card__head">
                <Badge tone="info" size="sm">
                  {notice.category}
                </Badge>
                <span className="notice-card__date">{formatDate(notice.date)}</span>
              </div>
              <h3 className="notice-card__title">{notice.title}</h3>
              <div className="notice-card__meta">
                <span className="notice-card__source">📌 {notice.source}</span>
              </div>
              <button
                className="notice-card__btn"
                onClick={() => handleViewOriginal(notice.link)}
              >
                원문보기
              </button>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
