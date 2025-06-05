import { Routes, Route } from 'react-router-dom';

import "./css/App.css";
import MyNavbar from './components/MyNavbar.jsx';
import ToastMessage from './components/ToastMessage.jsx'
import WelcomePage from './components/pages/WelcomePage.jsx';              //頁面
import ProductDetailPage from './components/pages/ProductDetailPage.jsx';  //頁面
import MyRecentlyViewedPage from './components/pages/MyRecentViewPage.jsx';    //頁面
import MyFavoritePage from './components/pages/MyFavoritePage.jsx'         //頁面 我的收藏 買家專用 (還沒寫買家才能進)
import MyCartPage from './components/pages/MyCartPage.jsx';                    //頁面 購物車 買家專用 (還沒寫買家才能進)
import CheckoutPage from './components/pages/CheckoutPage.jsx'             //頁面 結帳 買家專用   (還沒寫買家才能進)
import NotificationsPage from './components/pages/NotificationsPage.jsx';  //頁面
import UserLoginPage from './components/pages/UserLoginPage.jsx';          //頁面
import AdminLoginPage from './Admin/component/pages/AdminLoginPage.jsx';   //頁面
import UserOrderPage from './components/pages/OrderPage.jsx';              //頁面
import MemberInfoPage from './components/pages/MemberInfoPage.jsx';        //頁面
import SearchPage from './components/pages/SearchPage.jsx'                 //頁面
import CategoryPage from './components/pages/CategoryPage.jsx';            //頁面 分類頁 點到分類會顯示的
function App() {

  return (
    <>
      <MyNavbar />
      <main className="main-content animated-bg">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/search/" element={<SearchPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/myrecent" element={<MyRecentlyViewedPage />} />
          <Route path="/mycart" element={<MyCartPage />} />
          <Route path="/myfavorite" element={<MyFavoritePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />

          <Route path="/userlogin" element={<UserLoginPage />} />
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/memberinfo" element={<MemberInfoPage />} />
          <Route path="/orders" element={<UserOrderPage />} />
        </Routes>
        <ToastMessage />
      </main>
    </>
  );
}

export default App;