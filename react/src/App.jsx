import { Routes, Route } from 'react-router-dom';

import "./css/App.css";
<<<<<<< HEAD
import NormalMyNavbar from './component/MyNavbar.jsx';
import NormalWelcomePage from './component/pages/WelcomePage.jsx';            //頁面
import NormalRecentlyViewedPage from './component/pages/RecentViewPage.jsx';  //頁面
import NormalCartPage from './component/pages/CartPage.jsx';                  //頁面
import NormalMemberPage from './component/pages/MemberPage.jsx';              //頁面
import NormalNotificationsPage from './component/pages/NotificationsPage.jsx';//頁面
import NormalUserLoginPage from './component/pages/UserLoginPage.jsx';        //頁面
import NormalUserOrderPage from './component/pages/OrderPage.jsx';            //頁面
import AdminLoginPage from './Admin/component/pages/AdminLoginPage.jsx';             //頁面
=======
import MyNavbar from './component/MyNavbar.jsx';
import WelcomePage from './component/pages/WelcomePage.jsx';             //頁面
import RecentlyViewedPage from './component/pages/RecentViewPage.jsx';    //頁面
import CartPage from './component/pages/CartPage.jsx';                    //頁面
import MemberPage from './component/pages/MemberPage.jsx';                //頁面
import NotificationsPage from './component/pages/NotificationsPage.jsx';  //頁面
import UserLoginPage from './component/pages/UserLoginPage.jsx';          //頁面
import AdminLoginPage from './Admin/component/pages/AdminLoginPage.jsx';  //頁面
import UserOrderPage from './component/pages/OrderPage.jsx';              //頁面
import MemberInfoPage from './component/pages/MemberInfo.jsx';            //頁面

>>>>>>> branch 'main' of git@github.com:Balabababala/shoppingProject


function App() {



  return (
    <>
      <MyNavbar />
      <main className="main-content animated-bg">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/recent" element={<RecentlyViewedPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/member" element={<MemberPage />} />
          <Route path="/notificationsPage" element={<NotificationsPage />} />
          
          <Route path="/userlogin" element={<UserLoginPage />} />
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/memberinfo" element={<MemberInfoPage />} />
          <Route path="/orders" element={<UserOrderPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
