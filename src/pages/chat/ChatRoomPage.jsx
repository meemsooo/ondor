import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/common';
import { chatRooms, chatMessages } from '../../data';
import './ChatRoomPage.css';

export default function ChatRoomPage() {
  const { id } = useParams();
  const room = chatRooms.find((c) => c.id === id) ?? chatRooms[0];
  const [messages, setMessages] = useState(chatMessages[room.id] ?? []);
  const [text, setText] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // MVP: 로컬 상태에만 추가 (서버 연동 없음)
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, sender: 'me', text: text.trim(), time: '지금' },
    ]);
    setText('');
  };

  return (
    <>
      <Header title={room.partner} back />
      <div className="chat-room">
        <p className="chat-room__context">💬 {room.context}</p>
        <div className="chat-room__messages">
          {messages.map((m) => (
            <div key={m.id} className={`chat-msg ${m.sender === 'me' ? 'chat-msg--me' : ''}`}>
              <div className="chat-msg__bubble">{m.text}</div>
              <span className="chat-msg__time">{m.time}</span>
            </div>
          ))}
        </div>
      </div>

      <form className="chat-input" onSubmit={send}>
        <input
          className="chat-input__field"
          placeholder="메시지를 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="chat-input__send" aria-label="전송">
          ↑
        </button>
      </form>
    </>
  );
}
