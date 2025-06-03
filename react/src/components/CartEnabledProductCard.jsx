import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

function CartEnabledProductCard({ product }) {
  const { userData, setToastMessage, setCartItems } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
  if (!userData) {
    setToastMessage("請先登入才能加入購物車！");
    navigate('/userlogin');
    return;
  }

  let qty = product.quantity || 1; // ← 抓取來自 ProductCard 傳入的 quantity
  if (product.stock && qty > product.stock) qty = product.stock;

  fetch(`http://localhost:8080/api/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      userId: userData.userId,
      productId: product.id,
      quantity: qty
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`加入購物車失敗，狀態碼:${res.status}`);
      return res.json();
    })
    .then(() => {
      setToastMessage(`已加入購物車：${product.name} x ${qty}`);
      return fetch(`http://localhost:8080/api/cart`, {
        credentials: 'include',
      });
    })
    .then(res => res.json())
    .then(data => {
      if (!data || !data.data) {
        throw new Error("購物車資料格式錯誤");
      }
      setCartItems(data.data);
    })
    .catch(err => {
      setToastMessage(err.message);
    });
};


  return <ProductCard product={product} onAddToCart={handleAddToCart} />;
}

export default CartEnabledProductCard;
