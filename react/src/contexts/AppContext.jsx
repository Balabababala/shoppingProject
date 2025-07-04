import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  // const BASE_URL = 'http://localhost:8080';
  const BASE_URL = 'https://shoppingproject.onrender.com';
  // const API_BASE = 'http://localhost:8080/api';
  const API_BASE = 'https://shoppingproject.onrender.com/api';

  const [userData, setUserData] = useState(() => {
  const token = localStorage.getItem('token');
  const userDataStr = localStorage.getItem('userData');
  if (token && userDataStr) {
    try {
      const parsed = JSON.parse(userDataStr);
      if (parsed.token && parsed.user) {
        return parsed;
      }
    } catch (e) {
      console.warn('localStorage userData 解析錯誤');
    }
  }
  return null;
  });
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessages, setToastMessages] = useState([]);

  const initialUserCheckDone = useRef(false);

  // ★ 建議先定義 addToastMessage，方便後面函式使用
  const addToastMessage = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToastMessages((prev) => [...prev, { id, text }]);
  }, []);

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

  const clearCart = useCallback(async () => {
    if (!userData) return;
    try {
      const resp = await fetch(`${API_BASE}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (!resp.ok) throw new Error('清空購物車失敗');
      setCartItems([]);
      addToastMessage('購物車已清空');
    } catch (err) {
      console.error('清空購物車錯誤:', err);
      addToastMessage('清空購物車失敗，請稍後再試');
      throw err;
    }
  }, [API_BASE, userData, addToastMessage]);

  const addToCart = useCallback(async (productId, quantity) => {
    if (!userData) return;
    try {
      const resp = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!resp.ok) throw new Error('加入購物車失敗');
      await fetchCart();
      addToastMessage('已加入購物車');
    } catch (err) {
      console.error('加入購物車錯誤:', err);
      addToastMessage('加入購物車失敗，請稍後再試');
      throw err;
    }
  }, [API_BASE, userData, addToastMessage, fetchCart]);

  const handleLogout = useCallback((msg = '您已登出') => {
    
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
    

    if (!token) {
      setLoadingAuth(false);
      initialUserCheckDone.current = true;
      return;
    }

    (async () => {
      const res = await fetchWithAuthCheck(`${API_BASE}/user/me`);
      
      if (res?.authError) {
        handleLogout('您尚未登入，請重新登入');
      } else if (res) {
        const userObj = res.data ?? res;
        if (userObj && userObj.username) {
          setUserData({ token, user: userObj });
        } else {
          setUserData(null);
        }
      } else {
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

  // userData 改變時抓購物車
  useEffect(() => {
    if (userData) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [userData, fetchCart]);

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
        clearCart,
        fetchCart,
        addToCart,
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
