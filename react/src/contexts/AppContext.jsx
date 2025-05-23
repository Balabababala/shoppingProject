import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const API_BASE = 'http://localhost:8080/api';

  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // 取分類
  useEffect(() => {
    fetch(`${API_BASE}/categories/top-mynavbar`)
      .then(resp => resp.json())
      .then(data => setCategories(data.data))
      .catch(console.error);
  }, []);

  // 取使用者資訊
  useEffect(() => {
    fetch(`${API_BASE}/user`, { credentials: 'include' })
      .then(resp => resp.json())
      .then(data => setUserData(data.data))
      .catch(console.error);
  }, []);

  // 取購物車資料 (userData 有時需要存在依賴陣列裡面)
  useEffect(() => {
    if (!userData) return; // 沒登入就不取購物車
    fetch(`${API_BASE}/cart`, { credentials: 'include' })
      .then(resp => resp.json())
      .then(data => setCartItems(data.data))
      .catch(console.error);
  }, [userData]);

  return (
    <AppContext.Provider value={{ userData, setUserData, cartItems, categories }}>
      {children}
    </AppContext.Provider>
  );
}
