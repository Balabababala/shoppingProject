import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const API_BASE = 'http://localhost:8080/api';

  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // 控制只在初始化時獲取使用者資訊，避免用 userData 當依賴導致循環呼叫
  const initialUserCheckDone = useRef(false);

  // 把 userData 寫入 localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  // 取分類 (只執行一次)
  useEffect(() => {
    fetch(`${API_BASE}/categories/top-mynavbar`, { headers: { 'Cache-Control': 'no-cache' } })
      .then(resp => resp.json())
      .then(data => setCategories(data.data))
      .catch(console.error);
  }, []);

  // 取使用者資訊，只在初始化時執行一次
  useEffect(() => {
    if (!initialUserCheckDone.current) {
      fetch(`${API_BASE}/user`, { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } })
        .then(resp => resp.json())
        .then(data => {
          if (data.data) {
            setUserData(data.data);
          } else {
            setUserData(null);
            setCartItems([]);
            setToastMessage('您尚未登入，請重新登入');
          }
        })
        .catch(error => {
          console.error(error);
          setUserData(null);
          setCartItems([]);
          setToastMessage('無法取得使用者資訊，請稍後再試');
        })
        .finally(() => {
          initialUserCheckDone.current = true;
        });
    }
  }, []);

  // 定時檢查使用者登入狀態 (每5分鐘)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_BASE}/user`, { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } })
        .then(resp => resp.json())
        .then(data => {
          if (!data.data) {
            setUserData(null);
            setCartItems([]);
            setToastMessage('您已登出，請重新登入');
          }
        })
        .catch(() => {
          setUserData(null);
          setCartItems([]);
        });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // fetchCart 函式
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
      console.error(error);
    }
  }, [userData]);

  // 清空購物車
  const clearCart = async () => {
    try {
      setCartItems([]);
      const resp = await fetch(`${API_BASE}/cart/clear`, {
        method: 'POST',  // 建議用 POST，如果後端只支援 GET，也可改回去
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await resp.json();
      if (data.message && data.message.includes('成功')) {
        await fetchCart();
        setToastMessage('購物車已清空');
      } else {
        setToastMessage('清空購物車失敗: ' + (data.message || '未知錯誤'));
      }
    } catch (error) {
      setToastMessage('清空購物車錯誤: ' + error.message);
    }
  };

  // 預設呼叫 fetchCart 保持購物車資料同步
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 可選：toastMessage 自動清除（3秒後）
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        cartItems,
        setCartItems,
        categories,
        toastMessage,
        setToastMessage,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
