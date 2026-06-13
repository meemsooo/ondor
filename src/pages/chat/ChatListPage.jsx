import { useNavigate } from 'react-router-dom';
import { Header, Avatar, EmptyState } from '../../components/common';
import { chatRooms } from '../../data';
import { to } from '../../routes/paths';
import './ChatListPage.css';

export default function ChatListPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="채팅" />
      <div className="page--flush">
        {chatRooms.length === 0 ? (
          <EmptyState emoji="✉️" title="아직 채팅이 없어요" description="이웃과 대화를 시작해보세요!" />
        ) : (
          <ul className="chat-list">
            {chatRooms.map((c) => (
              <li key={c.id}>
                <button className="chat-list__item" onClick={() => navigate(to.chatRoom(c.id))}>
                  <Avatar emoji={c.avatar} size="md" />
                  <div className="chat-list__body">
                    <div className="chat-list__top">
                      <span className="chat-list__name">{c.partner}</span>
                      <span className="chat-list__time">{c.updatedAt}</span>
                    </div>
                    <p className="chat-list__context">{c.context}</p>
                    <p className="chat-list__last line-clamp-1">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 ? <span className="chat-list__unread">{c.unread}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
