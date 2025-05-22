import { Routes, Route } from 'react-router-dom';

import "./css/App.css";
import MyNavbar from './components/MyNavbar.jsx';
import WelcomePage from './components/pages/WelcomePage.jsx';              //頁面
import ProductDetailPage from './components/pages/ProductDetailPage.jsx';              //頁面
import RecentlyViewedPage from './components/pages/RecentViewPage.jsx';    //頁面
import CartPage from './components/pages/CartPage.jsx';                    //頁面
import MemberPage from './components/pages/MemberPage.jsx';                //頁面
import NotificationsPage from './components/pages/NotificationsPage.jsx';  //頁面
import UserLoginPage from './components/pages/UserLoginPage.jsx';          //頁面
import AdminLoginPage from './Admin/component/pages/AdminLoginPage.jsx';  //頁面
import UserOrderPage from './components/pages/OrderPage.jsx';              //頁面
import MemberInfoPage from './components/pages/MemberInfo.jsx';            //頁面

function App() {

  return (
    <>
      <MyNavbar />
      <main className="main-content animated-bg">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
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