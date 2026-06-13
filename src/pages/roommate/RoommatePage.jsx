import { useNavigate } from 'react-router-dom';
import { Header, Card, Badge, Avatar, Button } from '../../components/common';
import { roommateProfiles, lifestyleFields } from '../../data';
import { PATHS } from '../../routes/paths';
import './RoommatePage.css';

export default function RoommatePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="룸메이트 매칭" showChat />

      <div className="page stack">
        {/* 매칭 시작 배너 */}
        <Card className="rm-banner" onClick={() => navigate(PATHS.ROOMMATE_SURVEY)}>
          <div className="rm-banner__text">
            <p className="rm-banner__title">나와 맞는 룸메 찾기 (성향 테스트) 🛏️</p>
            <p className="rm-banner__sub">먼저 생활 성향 설문을 하고 매칭률을 확인해요</p>
          </div>
          <Button size="sm">시작</Button>
        </Card>

        {/* 프로필 카드 목록 */}
        {roommateProfiles.map((p) => (
          <Card key={p.id} onClick={() => navigate(PATHS.ROOMMATE_MATCHING)}>
            <div className="rm-card__head">
              <Avatar emoji={p.avatar} size="lg" />
              <div className="rm-card__id">
                <div className="rm-card__name-row">
                  <span className="rm-card__name">{p.nickname}</span>
                  <span className="rm-card__age">{p.age}세</span>
                </div>
                <p className="rm-card__major">{p.major}</p>
              </div>
              <div className="rm-card__match">
                <span className="rm-card__match-pct">{p.matchRate}%</span>
                <span className="rm-card__match-label">매칭률</span>
              </div>
            </div>

            <p className="rm-card__intro line-clamp-2">{p.intro}</p>

            <div className="rm-card__lifestyle">
              {lifestyleFields.map((f) => (
                <div key={f.key} className="rm-life">
                  <span className="rm-life__label">
                    {f.emoji} {f.label}
                  </span>
                  <span className="rm-life__value">{p.lifestyle[f.key]}</span>
                </div>
              ))}
            </div>

            <div className="rm-card__tags">
              {p.tags.map((t) => (
                <Badge key={t} tone="muted">
                  #{t}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
