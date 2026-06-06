import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button } from '../../components/common';
import { surveyQuestions } from '../../data';
import { PATHS } from '../../routes/paths';
import './SurveyPage.css';

export default function SurveyPage() {
  const navigate = useNavigate();
  // { 문항id: 선택값 }
  const [answers, setAnswers] = useState({});

  const select = (questionId, value) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const allAnswered = surveyQuestions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;
    navigate(PATHS.ROOMMATE_MATCHING, { state: { answers } });
  };

  return (
    <>
      <Header title="생활 성향 설문" back />

      <div className="page stack">
        <p className="survey__lead">
          6개 문항에 답하면 나와 잘 맞는 룸메이트를 찾아드려요 🛏️
        </p>

        {surveyQuestions.map((q, i) => (
          <Card key={q.id} className="survey-q">
            <p className="survey-q__category">{q.category}</p>
            <p className="survey-q__question">
              {i + 1}. {q.question}
            </p>
            <div className="survey-q__options">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`survey-opt ${selected ? 'is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => select(q.id, opt.value)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}

        <Button block disabled={!allAnswered} onClick={handleSubmit}>
          결과 보기
        </Button>
      </div>
    </>
  );
}
