import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const API_BASE = 'http://localhost:8080/api';

  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // 取分類
  useEffect(() => {
    fetch(`${API_BASE}/categories/top-mynavbar`, { headers: { 'Cache-Control': 'no-cache' } })
      .then(resp => resp.json())
      .then(data => setCategories(data.data))
      .catch(console.error);
  }, []);

  // 取使用者資訊
  useEffect(() => {
    fetch(`${API_BASE}/user`, { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } })
      .then(resp => resp.json())
      .then(data => setUserData(data.data))
      .catch(console.error);
  }, []);

  // 取得購物車資料，依賴 userData，並加防快取
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
      console.log('fetchCart 從後端拿到：', data.data);
      if (Array.isArray(data.data)) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [userData]);

  // useEffect 呼叫 fetchCart 同步購物車
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 清空購物車
  const clearCart = async () => {
  try {
    setCartItems([]); // 先清空本地狀態，UI 立即反應
    const resp = await fetch(`${API_BASE}/cart/clear`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-cache' },
    });
    const data = await resp.json();
    console.log('clearCart API 回傳:', data);

    if (data.message && data.message.includes('成功')) {
      await fetchCart(); // 從後端重新拉資料，確保狀態一致
      setToastMessage('購物車已清空');
    } else {
      setToastMessage('清空購物車失敗: ' + (data.message || '未知錯誤'));
    }
  } catch (error) {
    setToastMessage('清空購物車錯誤: ' + error.message);
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
