// admin/AdminAppContext.jsx
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const AdminAppContext = createContext();

export function AdminAppProvider({ children }) {
  const API_BASE = 'http://localhost:8080/api';
  const BASE_URL = 'http://localhost:8080';   
  const [adminUserData, setAdminUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [toastMessages, setToastMessages] = useState([]);

  const initialAdminCheckDone = useRef(false);

  // 同步 adminUserData 到 localStorage（如果需要）
  useEffect(() => {
    if (adminUserData) {
      localStorage.setItem('adminUserData', JSON.stringify(adminUserData));
    } else {
      localStorage.removeItem('adminUserData');
    }
  }, [adminUserData]);

  // 初次驗證後台管理員登入狀態
  useEffect(() => {
  if (initialAdminCheckDone.current) return;

  const fetchAdminUser = async () => {
    const data = await fetchWithAuthCheck(`${API_BASE}/admin/me`);
    console.log('fetchAdminUser response:', data);
    if (data?.authError) {
      handleLogout('尚未登入後台，請重新登入');
    } else if (data?.data) {
      setAdminUserData(data.data);
    } else if (data) {
      setAdminUserData(data);
    } else {
      setAdminUserData(null);
    }
    initialAdminCheckDone.current = true;
    setLoadingAuth(false);
  };

  fetchAdminUser();
}, []);


  // 定時驗證後台登入狀態（5 分鐘一次）
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchWithAuthCheck(`${API_BASE}/admin/me`);
      if (data?.authError) {
        handleLogout('後台登入狀態過期，請重新登入');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = (msg = '您已登出後台') => {
    setAdminUserData(null);
    localStorage.removeItem('adminUserData');
    addToastMessage(msg);
  };

  const addToastMessage = (text) => {
    const id = Date.now() + Math.random();
    setToastMessages((prev) => [...prev, { id, text }]);
  };

  const removeToastMessage = (id) => {
    setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const fetchWithAuthCheck = async (url, options = {}) => {
    try {
      const resp = await fetch(url, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache', ...(options.headers || {}) },
        ...options,
      });

      if (resp.status === 401 || resp.status === 403) {
        return { authError: true };
      }

      return await resp.json();
    } catch (err) {
      console.error('API 呼叫失敗:', err);
      return null;
    }
  };

  return (
    <AdminAppContext.Provider
      value={{
        adminUserData,
        setAdminUserData,
        toastMessages,
        addToastMessage,
        removeToastMessage,
        handleLogout,
        fetchWithAuthCheck,
        API_BASE,
        BASE_URL,
      }}
    >
      {loadingAuth ? <div>後台載入中...</div> : children}
    </AdminAppContext.Provider>
  );
}
