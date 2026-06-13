import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Badge, Avatar, EmptyState } from '../../components/common';
import { roommateProfiles, lifestyleFields } from '../../data';
import { PATHS } from '../../routes/paths';
import { getMatchedProfiles } from './matchScore';
import './RoommateMatchingPage.css';

export default function RoommateMatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [index, setIndex] = useState(0);

  // 설문에서 넘어온 답이 있으면 점수 계산 + 정렬, 없으면 기본 목록(기존 순서)
  const answers = location.state?.answers;
  const profiles = answers ? getMatchedProfiles(answers, roommateProfiles) : roommateProfiles;

  const profile = profiles[index];
  const next = () => setIndex((i) => i + 1);

  if (!profile) {
    return (
      <>
        <Header title="룸메이트 매칭" back />
        <EmptyState
          emoji="🎉"
          title="오늘의 추천을 모두 확인했어요"
          description="내일 새로운 룸메이트를 추천해드릴게요!"
        />
        <div className="page">
          <button className="rm-match__again" onClick={() => navigate(PATHS.ROOMMATE)}>
            목록으로 돌아가기
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="룸메이트 매칭" back />

      <div className="page rm-match">
        <div className="rm-match__card">
          <span className="rm-match__match-chip">
            매칭률 {answers ? profile.matchScore : profile.matchRate}%
          </span>
          <Avatar emoji={profile.avatar} size="lg" className="rm-match__avatar" />
          <div className="rm-match__name-row">
            <span className="rm-match__name">{profile.nickname}</span>
            <span className="rm-match__age">{profile.age}세 · {profile.major}</span>
          </div>
          <p className="rm-match__intro">{profile.intro}</p>

          <div className="rm-match__lifestyle">
            {lifestyleFields.map((f) => (
              <div key={f.key} className="rm-match__life">
                <span className="rm-match__life-emoji">{f.emoji}</span>
                <span className="rm-match__life-label">{f.label}</span>
                <span className="rm-match__life-value">{profile.lifestyle[f.key]}</span>
              </div>
            ))}
          </div>

          <div className="rm-match__tags">
            {profile.tags.map((t) => (
              <Badge key={t} tone="primary">#{t}</Badge>
            ))}
          </div>
        </div>

        {/* 좋아요 / 패스 */}
        <div className="rm-match__actions">
          <button className="rm-match__btn rm-match__btn--pass" onClick={next}>
            ✕
          </button>
          <button
            className="rm-match__btn rm-match__btn--like"
            onClick={() => {
              alert(`${profile.nickname}님에게 룸메 신청을 보냈어요! (더미)`);
              navigate(PATHS.CHAT);
            }}
          >
            ♥
          </button>
        </div>
        <p className="rm-match__hint">패스하거나 마음에 들면 신청해보세요</p>
      </div>
    </>
  );
}
