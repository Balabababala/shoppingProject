import { Routes, Route } from 'react-router-dom';
import './css/App.css';
import MyNavbar from './component/myNavbar';
import WelcomePage from './component/pages/WelcomePage';           //頁面
import RecentlyViewedPage from './component/pages/RecentViewPage'; //頁面
import CartPage from './component/pages/CartPage';                 //頁面
import MemberPage from './component/pages/MemberPage';             //頁面
import NoticePage from './component/pages/NoticePage';             //頁面
import LoginPage from './component/pages/LoginPage';               //頁面
// 其他你需要的頁面...

function App() {
  return (
    <>
      <MyNavbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/recent" element={<RecentlyViewedPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/member" element={<MemberPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
