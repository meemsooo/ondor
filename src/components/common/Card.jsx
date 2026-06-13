import './Card.css';

/**
 * 카드 컨테이너 (오늘의집 느낌의 부드러운 카드)
 */
export default function Card({ children, onClick, className = '', padded = true, ...rest }) {
  return (
    <div
      className={`card ${padded ? 'card--padded' : ''} ${onClick ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
