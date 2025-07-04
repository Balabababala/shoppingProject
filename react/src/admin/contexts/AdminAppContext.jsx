import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const AdminAppContext = createContext();

export function AdminAppProvider({ children }) {
  // const BASE_URL = 'http://localhost:8080';
  const BASE_URL = 'https://shoppingproject.onrender.com';
  // const API_BASE = 'http://localhost:8080/api';
  const API_BASE = 'https://shoppingproject.onrender.com/api';

  // 1. 從 localStorage 初始化 token 和 adminUser
  const [adminUserData, setAdminUserData] = useState(() => {
    const token = localStorage.getItem('adminToken');
    const userDataStr = localStorage.getItem('adminUserData');
    if (token && userDataStr) {
      try {
        const parsed = JSON.parse(userDataStr);
        if (parsed.username || parsed.role) {
          return { token, user: parsed };
        }
      } catch (e) {
        console.warn('localStorage adminUserData 解析錯誤');
      }
    }
    return null;
  });

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [toastMessages, setToastMessages] = useState([]);
  const initialAdminCheckDone = useRef(false);

  // 2. Toast 工具
  const addToastMessage = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToastMessages((prev) => [...prev, { id, text }]);
  }, []);

  const removeToastMessage = useCallback((id) => {
    setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  // 3. 加入 token 驗證的 fetch 方法
  const fetchWithAuthCheck = useCallback(async (url, options = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Cache-Control': 'no-cache',
        ...(options.headers || {}),
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(url, { ...options, headers });
      if (resp.status === 401 || resp.status === 403) return { authError: true };

      return await resp.json();
    } catch (err) {
      console.error('API 呼叫失敗:', err);
      return null;
    }
  }, []);

  // 4. 登出邏輯
  const handleLogout = useCallback((msg = '您已登出後台') => {
    setAdminUserData(null);
    localStorage.removeItem('adminUserData');
    localStorage.removeItem('adminToken');
    addToastMessage(msg);
  }, [addToastMessage]);

  // 5. 同步 localStorage
  useEffect(() => {
    if (adminUserData?.user && adminUserData.token) {
      localStorage.setItem('adminUserData', JSON.stringify(adminUserData.user));
      localStorage.setItem('adminToken', adminUserData.token);
    } else {
      localStorage.removeItem('adminUserData');
      localStorage.removeItem('adminToken');
    }
  }, [adminUserData]);

  // 6. 初次登入狀態檢查
  useEffect(() => {
    if (initialAdminCheckDone.current) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoadingAuth(false);
      initialAdminCheckDone.current = true;
      return;
    }

    (async () => {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/me`);
      if (res?.authError) {
        handleLogout('尚未登入後台，請重新登入');
      } else if (res?.data) {
        setAdminUserData({ token, user: res.data });
      } else if (res && res.username) {
        setAdminUserData({ token, user: res });
      } else {
        setAdminUserData(null);
      }
      initialAdminCheckDone.current = true;
      setLoadingAuth(false);
    })();
  }, [fetchWithAuthCheck, handleLogout]);

  // 7. 定時驗證登入狀態
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/me`);
      if (res?.authError) {
        handleLogout('後台登入狀態已過期，請重新登入');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWithAuthCheck, handleLogout]);

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
      {loadingAuth ? <div className="text-center py-5">後台載入中...</div> : children}
    </AdminAppContext.Provider>
  );
}
