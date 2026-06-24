import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { PATHS } from './paths';

// 페이지
import HomePage from '../pages/home/HomePage';
import HelpPage from '../pages/help/HelpPage';
import HelpFormPage from '../pages/help/HelpFormPage';
import HelpDetailPage from '../pages/help/HelpDetailPage';
import GroupBuyPage from '../pages/groupbuy/GroupBuyPage';
import GroupBuyFormPage from '../pages/groupbuy/GroupBuyFormPage';
import GroupBuyDetailPage from '../pages/groupbuy/GroupBuyDetailPage';
import RentalPage from '../pages/rental/RentalPage';
import RentalFormPage from '../pages/rental/RentalFormPage';
import RentalDetailPage from '../pages/rental/RentalDetailPage';
import RentalHistoryPage from '../pages/rental/RentalHistoryPage';
import RoommatePage from '../pages/roommate/RoommatePage';
import RoommateMatchingPage from '../pages/roommate/RoommateMatchingPage';
import CommunityPage from '../pages/community/CommunityPage';
import CommunityFormPage from '../pages/community/CommunityFormPage';
import CommunityDetailPage from '../pages/community/CommunityDetailPage';
import NoticesPage from '../pages/notices/NoticesPage';
import NoticeDetailPage from '../pages/notices/NoticeDetailPage';
import ChatListPage from '../pages/chat/ChatListPage';
import ChatRoomPage from '../pages/chat/ChatRoomPage';
import MyPage from '../pages/mypage/MyPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={PATHS.HOME} element={<HomePage />} />

        {/* 도움 요청 */}
        <Route path={PATHS.HELP} element={<HelpPage />} />
        <Route path={PATHS.HELP_NEW} element={<HelpFormPage />} />
        <Route path={PATHS.HELP_EDIT} element={<HelpFormPage />} />
        <Route path={PATHS.HELP_DETAIL} element={<HelpDetailPage />} />

        {/* 공동구매 */}
        <Route path={PATHS.GROUPBUY} element={<GroupBuyPage />} />
        <Route path={PATHS.GROUPBUY_NEW} element={<GroupBuyFormPage />} />
        <Route path={PATHS.GROUPBUY_EDIT} element={<GroupBuyFormPage />} />
        <Route path={PATHS.GROUPBUY_DETAIL} element={<GroupBuyDetailPage />} />

        {/* 물건 대여 */}
        <Route path={PATHS.RENTAL} element={<RentalPage />} />
        <Route path={PATHS.RENTAL_NEW} element={<RentalFormPage />} />
        <Route path={PATHS.RENTAL_HISTORY} element={<RentalHistoryPage />} />
        <Route path={PATHS.RENTAL_EDIT} element={<RentalFormPage />} />
        <Route path={PATHS.RENTAL_DETAIL} element={<RentalDetailPage />} />

        {/* 룸메이트 매칭 */}
        <Route path={PATHS.ROOMMATE} element={<RoommatePage />} />
        <Route path={PATHS.ROOMMATE_MATCHING} element={<RoommateMatchingPage />} />

        {/* 커뮤니티 */}
        <Route path={PATHS.COMMUNITY} element={<CommunityPage />} />
        <Route path={PATHS.COMMUNITY_NEW} element={<CommunityFormPage />} />
        <Route path={PATHS.COMMUNITY_EDIT} element={<CommunityFormPage />} />
        <Route path={PATHS.COMMUNITY_DETAIL} element={<CommunityDetailPage />} />

        {/* 기숙사 공지사항 */}
        <Route path={PATHS.NOTICES} element={<NoticesPage />} />
        <Route path={PATHS.NOTICES_DETAIL} element={<NoticeDetailPage />} />

        {/* 채팅 */}
        <Route path={PATHS.CHAT} element={<ChatListPage />} />
        <Route path={PATHS.CHAT_ROOM} element={<ChatRoomPage />} />

        {/* 마이페이지 */}
        <Route path={PATHS.MYPAGE} element={<MyPage />} />
      </Route>

      {/* 알 수 없는 경로 → 홈 */}
      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  );
}
