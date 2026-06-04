import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import './AppLayout.css';

/**
 * 앱 전역 레이아웃 — 모바일 프레임 + 하단 네비게이션
 * 각 페이지는 <Outlet />으로 렌더링된다.
 */
export default function AppLayout() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
