import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminNavbar from './components/AdminNavbar.jsx'
import { AdminAppContext } from './contexts/AdminAppContext';

import AdminProductListPage from './pages/AdminProductListPage.jsx';
// import AdminProductNewPage from './pages/AdminProductNewPage.jsx';
// import AdminProductEditPage from './pages/AdminProductEditPage.jsx';
// import AdminCategoryManagePage from './pages/AdminCategoryManagePage.jsx';
// import AdminInventoryManagePage from './pages/AdminInventoryManagePage.jsx';
// import AdminReviewManagePage from './pages/AdminReviewManagePage.jsx';

// import AdminUserListPage from './pages/AdminUserListPage.jsx';
// import AdminPermissionManagePage from './pages/AdminPermissionManagePage.jsx';
// import AdminUserDeactivatedPage from './pages/AdminUserDeactivatedPage.jsx';

// import AdminRecommendRulesPage from './pages/AdminRecommendRulesPage.jsx';
// import AdminRecommendContentPage from './pages/AdminRecommendContentPage.jsx';

// import AdminSearchHistoryPage from './pages/AdminSearchHistoryPage.jsx';
// import AdminBrowseHistoryPage from './pages/AdminBrowseHistoryPage.jsx';

// import AdminChangePasswordPage from './pages/AdminChangePasswordPage.jsx';
// import AdminLogoutPage from './pages/AdminLogoutPage.jsx';
import ToastMessage from './components/ToastMessage.jsx'

function AdminApp() {
  const { adminUserData  } = useContext(AdminAppContext);
  console.log('adminUserData:', adminUserData);
  return (
    
     <div style={{ height: '100vh' }}>

      {/* 如果有登入資料就顯示 NavBar */}
      {adminUserData?.roleId === 3 && <AdminNavbar />}
      <Routes>
        {/* 這裡放後台路由設定 */}
         <Route path="/" element={<AdminLoginPage />} />
         <Route path="/dashboard" element={<AdminDashboardPage />} />
         <Route path="/products" element={<AdminProductListPage />} />
        {/* 其他子路由 */}
       
      </Routes>
      <ToastMessage />
    </div>
  );
}

export default AdminApp;
