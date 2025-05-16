import { Routes, Route } from 'react-router-dom';

import "./normal/css/App.css";
import NormalMyNavbar from './normal/component/MyNavbar.jsx';
import NormalWelcomePage from './normal/component/pages/WelcomePage.jsx';            //頁面
import NormalRecentlyViewedPage from './normal/component/pages/RecentViewPage.jsx';  //頁面
import NormalCartPage from './normal/component/pages/CartPage.jsx';                  //頁面
import NormalMemberPage from './normal/component/pages/MemberPage.jsx';              //頁面
import NormalNotificationsPage from './normal/component/pages/NotificationsPage.jsx';//頁面
import NormalUserLoginPage from './normal/component/pages/UserLoginPage.jsx';        //頁面
import NormalUserOrderPage from './normal/component/pages/OrderPage.jsx';            //頁面
import AdminLoginPage from './Admin/component/pages/AdminLoginPage.jsx';             //頁面


function App() {
  return (
    <>
      <NormalMyNavbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<NormalWelcomePage />} />
          <Route path="/recent" element={<NormalRecentlyViewedPage />} />
          <Route path="/cart" element={<NormalCartPage />} />
          <Route path="/member" element={<NormalMemberPage />} />
          <Route path="/notificationsPage" element={<NormalNotificationsPage />} />
          <Route path="/userlogin" element={<NormalUserLoginPage />} />
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/orders" element={<NormalUserOrderPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
