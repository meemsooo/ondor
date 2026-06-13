import { Header, Card, Badge, EmptyState } from '../../components/common';
import { receivedPokes, pokeCategories } from '../../data';
import './PokeReceivedPage.css';

export default function PokeReceivedPage() {
  return (
    <>
      <Header title="받은 콕 찌르기" back />

      {receivedPokes.length === 0 ? (
        <EmptyState
          emoji="🔔"
          title="받은 알림이 없어요"
          description="아직 도착한 콕 찌르기가 없어요."
        />
      ) : (
        <div className="page stack">
          {receivedPokes.map((poke) => {
            const cat = pokeCategories.find((c) => c.id === poke.category);
            if (!cat) return null;

            return (
              <Card
                key={poke.id}
                className={`poke-item ${poke.isRead ? '' : 'is-unread'}`}
              >
                <div className="poke-item__head">
                  <span className="poke-item__emoji">{cat.emoji}</span>
                  <div className="poke-item__title-wrap">
                    <div className="poke-item__title-row">
                      <span className="poke-item__label">{cat.label}</span>
                      {!poke.isRead && <span className="poke-item__dot" aria-label="안 읽음" />}
                    </div>
                    <span className="poke-item__from">누군가 정중히 알려왔어요</span>
                  </div>
                  <span className="poke-item__time">{poke.createdAt}</span>
                </div>

                <p className="poke-item__msg">“{cat.message}”</p>

                <Badge tone="muted">익명</Badge>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
