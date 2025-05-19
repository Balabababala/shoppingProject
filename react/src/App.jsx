import { Routes, Route } from 'react-router-dom';

import "./css/App.css";
import NormalMyNavbar from './component/MyNavbar.jsx';
import NormalWelcomePage from './component/pages/WelcomePage.jsx';             //頁面
import NormalRecentlyViewedPage from './component/pages/RecentViewPage.jsx';    //頁面
import NormalCartPage from './component/pages/CartPage.jsx';                    //頁面
import NormalMemberPage from './component/pages/MemberPage.jsx';                //頁面
import NormalNotificationsPage from './component/pages/NotificationsPage.jsx';  //頁面
import NormalUserLoginPage from './component/pages/UserLoginPage.jsx';          //頁面
import NormalUserOrderPage from './component/pages/OrderPage.jsx';              //頁面
import AdminLoginPage from './Admin/component/pages/AdminLoginPage.jsx';        //頁面


function App() {



  return (
    <>
      <NormalMyNavbar />
      <main className="main-content animated-bg">
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
