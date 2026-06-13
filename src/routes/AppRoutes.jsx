import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { PATHS } from './paths';

// 페이지
import HomePage from '../pages/home/HomePage';
import HelpPage from '../pages/help/HelpPage';
import HelpWritePage from '../pages/help/HelpWritePage';
import HelpMatchingPage from '../pages/help/HelpMatchingPage';
import GroupBuyPage from '../pages/groupbuy/GroupBuyPage';
import GroupBuyDetailPage from '../pages/groupbuy/GroupBuyDetailPage';
import RentalPage from '../pages/rental/RentalPage';
import RentalRegisterPage from '../pages/rental/RentalRegisterPage';
import RentalHistoryPage from '../pages/rental/RentalHistoryPage';
import RoommatePage from '../pages/roommate/RoommatePage';
import SurveyPage from '../pages/roommate/SurveyPage';
import RoommateMatchingPage from '../pages/roommate/RoommateMatchingPage';
import PokeSendPage from '../pages/poke/PokeSendPage';
import CommunityPage from '../pages/community/CommunityPage';
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
        <Route path={PATHS.HELP_WRITE} element={<HelpWritePage />} />
        <Route path={PATHS.HELP_MATCHING} element={<HelpMatchingPage />} />

        {/* 공동구매 */}
        <Route path={PATHS.GROUPBUY} element={<GroupBuyPage />} />
        <Route path={PATHS.GROUPBUY_DETAIL} element={<GroupBuyDetailPage />} />

        {/* 물건 대여 */}
        <Route path={PATHS.RENTAL} element={<RentalPage />} />
        <Route path={PATHS.RENTAL_REGISTER} element={<RentalRegisterPage />} />
        <Route path={PATHS.RENTAL_HISTORY} element={<RentalHistoryPage />} />

        {/* 룸메이트 매칭 */}
        <Route path={PATHS.ROOMMATE} element={<RoommatePage />} />
        <Route path={PATHS.ROOMMATE_SURVEY} element={<SurveyPage />} />
        <Route path={PATHS.ROOMMATE_MATCHING} element={<RoommateMatchingPage />} />

        {/* 콕 찌르기 */}
        <Route path={PATHS.POKE_SEND} element={<PokeSendPage />} />

        {/* 커뮤니티 */}
        <Route path={PATHS.COMMUNITY} element={<CommunityPage />} />

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
