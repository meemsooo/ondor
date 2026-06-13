import { NavLink } from 'react-router-dom';
import { bottomNavItems } from '../../config/navigation';
import './BottomNavigation.css';

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      {bottomNavItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
