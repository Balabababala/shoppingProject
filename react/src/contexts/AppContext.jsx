import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const API_BASE = 'http://localhost:8080/api';

  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessages, setToastMessages] = useState([]);

  const initialUserCheckDone = useRef(false);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  useEffect(() => {
    if (userData) fetchCart();
  }, [userData]);

  useEffect(() => {
    fetch(`${API_BASE}/categories/top-mynavbar`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then(resp => resp.json())
      .then(data => setCategories(data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initialUserCheckDone.current) return;

    const fetchUserData = async () => {
      const data = await fetchWithAuthCheck(`${API_BASE}/user/me`);
      if (data?.data) {
        setUserData(data.data);
      } else {
        handleLogout('您尚未登入，請重新登入');
      }

      initialUserCheckDone.current = true;
      setLoadingAuth(false);
    };

    fetchUserData();
  }, []);

  // 🔁 定時驗證登入狀態
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchWithAuthCheck(`${API_BASE}/user/me`);
      if (!data?.data) {
        handleLogout('登入狀態已過期，請重新登入');
      }
    }, 5 * 60 * 1000); // 每5分鐘

    return () => clearInterval(interval);
  }, []);

  const handleLogout = (msg = '您已登出') => {
    setUserData(null);
    setCartItems([]);
    localStorage.removeItem('userData');
    addToastMessage(msg);
  };

  const fetchCart = useCallback(async () => {
    if (!userData) {
      setCartItems([]);
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/cart`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await resp.json();
      if (Array.isArray(data.data)) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('取得購物車失敗:', error);
    }
  }, [userData]);

  const addToCart = async (product, quantity = 1) => {
    if (!userData) {
      addToastMessage('請先登入才能加入購物車');
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const data = await resp.json();

      if (data.message?.includes('成功')) {
        await fetchCart();
        addToastMessage('已成功加入購物車');
      } else {
        addToastMessage('加入購物車失敗: ' + (data.message || '未知錯誤'));
      }
    } catch (error) {
      addToastMessage('加入購物車錯誤: ' + error.message);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      const resp = await fetch(`${API_BASE}/cart/clear`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await resp.json();

      if (data.message?.includes('成功')) {
        await fetchCart();
        addToastMessage('購物車已清空');
      } else {
        addToastMessage('清空購物車失敗: ' + (data.message || '未知錯誤'));
      }
    } catch (error) {
      addToastMessage('清空購物車錯誤: ' + error.message);
    }
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
        handleLogout('登入狀態失效，請重新登入');
        return null;
      }

      return await resp.json();
    } catch (err) {
      console.error('API 呼叫失敗:', err);
      return null;
    }
  };

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
        removeToastMessage,
        clearCart,
        fetchCart,
        addToCart,
        fetchWithAuthCheck,
      }}
    >
      {loadingAuth ? <div>載入中...</div> : children}
    </AppContext.Provider>
  );
}
