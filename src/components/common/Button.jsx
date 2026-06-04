import './Button.css';

/**
 * 공통 버튼
 * @param {'primary'|'secondary'|'outline'|'ghost'} variant
 * @param {'lg'|'md'|'sm'} size
 * @param {boolean} block - 전체 너비
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
