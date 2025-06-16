import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';            // 前台主入口
import AdminApp from './admin/AdminApp'; // 後台主入口
import './css/index.css';
// main.jsx
import { AdminAppProvider } from './admin/contexts/AdminAppContext';
import { AppProvider } from './contexts/AppContext';  // 你定義的 Context Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminAppProvider>
            <AdminApp />
          </AdminAppProvider>
        }
      />
      <Route
        path="/*"
        element={
          <AppProvider>
            <App />
          </AppProvider>
        }
      />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
