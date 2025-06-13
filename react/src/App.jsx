import { Routes, Route } from 'react-router-dom';

import "./css/App.css";
import MyNavbar from './components/MyNavbar.jsx';
import ToastMessage from './components/ToastMessage.jsx'
import WelcomePage from './components/pages/WelcomePage.jsx';              //頁面
import ProductDetailPage from './components/pages/ProductDetailPage.jsx';  //頁面
import MyRecentlyViewedPage from './components/pages/MyRecentViewPage.jsx';//頁面
import MyFavoritePage from './components/pages/MyFavoritePage.jsx'         //頁面 我的收藏      買家專用   (後端還沒寫買家才能進)
import MyCartPage from './components/pages/MyCartPage.jsx';                //頁面 購物車        買家專用   (後端還沒寫買家才能進)
import CheckoutPage from './components/pages/CheckoutPage.jsx'             //頁面 結帳          買家專用   (後端還沒寫買家才能進)
import SellerProductsPage from './components/pages/SellerProductsPage.jsx' //頁面 我的商品       賣家專用   (後端還沒寫賣家才能進)
import SellerOrdersPage from './components/pages/SellerOrdersPage.jsx'             //頁面 我的商品       賣家專用   (後端還沒寫賣家才能進)
import SellerProductNewPage from './components/pages/SellerProductNewPage.jsx'     //頁面 新增商品       賣家專用   (後端還沒寫賣家才能進)
import SellerProductEditPage from './components/pages/SellerProductEditPage.jsx'     //頁面 編輯商品       賣家專用   (後端還沒寫賣家才能進)

import NotificationsPage from './components/pages/NotificationsPage.jsx';  //頁面
import RegisterPage from './components/pages/RegisterPage.jsx';            //註冊頁面
import EmailVerificationPage from './components/pages/EmailVerificationPage.jsx';            //Email驗證頁面
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
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<SellerProductNewPage />} />
          <Route path="/seller/products/edit/:id" element={<SellerProductEditPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/verify" element={<EmailVerificationPage />} />
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