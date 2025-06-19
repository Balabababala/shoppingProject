import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const BASE_URL = 'http://localhost:8080';
  const API_BASE = 'http://localhost:8080/api';

  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessages, setToastMessages] = useState([]);

  const initialUserCheckDone = useRef(false);

  // fetchWithAuthCheck 定義
  const fetchWithAuthCheck = useCallback(async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Cache-Control': 'no-cache', ...(options.headers || {}) };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(url, { ...options, headers });
      if (resp.status === 401 || resp.status === 403) return { authError: true };

      return await resp.json();
    } catch (err) {
      console.error('API 呼叫失敗:', err);
      return null;
    }
  }, []);

  const addToastMessage = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToastMessages((prev) => [...prev, { id, text }]);
  }, []);

  const handleLogout = useCallback((msg = '您已登出') => {
    console.log('handleLogout called, 清空 userData');
    setUserData(null);
    setCartItems([]);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    addToastMessage(msg);
  }, [addToastMessage]);

  // 同步 localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      if (userData.token) localStorage.setItem('token', userData.token);
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    }
  }, [userData]);

  // 抓購物車
  const fetchCart = useCallback(async () => {
    if (!userData) {
      setCartItems([]);
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${userData.token}`,
        },
      });
      const data = await resp.json();
      if (Array.isArray(data.data)) setCartItems(data.data);
      else setCartItems([]);
    } catch (err) {
      console.error('取得購物車失敗:', err);
      setCartItems([]);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      console.log('userData 有變動，開始抓購物車');
      fetchCart();
    } else {
      console.log('userData 是 null，清空購物車');
      setCartItems([]);
    }
  }, [userData, fetchCart]);

  // 抓分類
  useEffect(() => {
    fetch(`${API_BASE}/categories/top-mynavbar`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((resp) => resp.json())
      .then((data) => setCategories(data.data))
      .catch(console.error);
  }, []);

  // 初次登入狀態檢查（重要）
  useEffect(() => {
    if (initialUserCheckDone.current) return;

    const token = localStorage.getItem('token');
    console.log('初次驗證：localStorage token:', token);

    if (!token) {
      console.log('沒有 token，直接設定 loadingAuth false');
      setLoadingAuth(false);
      initialUserCheckDone.current = true;
      return;
    }

    (async () => {
      const res = await fetchWithAuthCheck(`${API_BASE}/user/me`);
      console.log('初次驗證：fetchUserData 結果:', res);
      if (res?.authError) {
        handleLogout('您尚未登入，請重新登入');
      } else if (res?.data) {
        // 建議這邊明確包成 user: {...}
        setUserData({ token, user: res.data });
      } else {
        console.warn('fetchUserData 無效回應，將清空 userData');
        setUserData(null);
      }
      initialUserCheckDone.current = true;
      setLoadingAuth(false);
    })();
  }, [fetchWithAuthCheck, handleLogout]);

  // 定時驗證登入狀態
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchWithAuthCheck(`${API_BASE}/user/me`);
      if (data?.authError) {
        handleLogout('登入狀態已過期，請重新登入');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWithAuthCheck, handleLogout]);

  // 輸出除錯資訊
  useEffect(() => {
    console.log('userData updated:', userData);
  }, [userData]);

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        cartItems,
        setCartItems,
        categories,
        toastMessages,
        addToastMessage,
        removeToastMessage: (id) => setToastMessages((prev) => prev.filter((msg) => msg.id !== id)),
        clearCart: async () => { /* 依你需求自行實作 */ },
        fetchCart,
        addToCart: async () => { /* 依你需求自行實作 */ },
        fetchWithAuthCheck,
        API_BASE,
        BASE_URL,
        handleLogout,
      }}
    >
      {loadingAuth ? <div>載入中...</div> : children}
    </AppContext.Provider>
  );
}
