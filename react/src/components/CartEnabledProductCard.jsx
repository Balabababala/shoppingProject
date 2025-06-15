import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { Button, Form } from 'react-bootstrap';

function CartEnabledProductCard({ product }) {
  
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { userData, setCartItems, addToastMessage ,BASE_API} = useContext(AppContext);
  const navigate = useNavigate();
  
  const handleAddToCart = () => {
    if (!userData) {
      addToastMessage('請先登入才能加入購物車！');
      navigate('/userlogin');
      return;
    }

    let qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (product.stock && qty > product.stock) qty = product.stock;

    setAdding(true);
    fetch(`${BASE_API}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: userData.userId,
        productId: product.id,
        quantity: qty,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`加入購物車失敗，狀態碼:${res.status}`);
        return res.json();
      })
      .then(() => {
        addToastMessage(`已加入購物車：${product.name} x ${qty}`);
        return fetch(`${BASE_API}/cart`, { credentials: 'include' });
      })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.data) throw new Error('購物車資料格式錯誤');
        setCartItems(data.data);
      })
      .catch((err) => {
        addToastMessage(err.message);
      })
      .finally(() => setAdding(false));
  };

  return (
    <div className="card h-100 shadow-sm rounded-3" style={{ overflow: 'hidden' }}>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{ objectFit: 'cover', height: '180px', width: '100%' }}
        />
      ) : (
        <div
          className="bg-secondary text-white d-flex align-items-center justify-content-center"
          style={{ height: '180px' }}
        >
          <span className="fs-5">無圖片</span>
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{product.name}</h5>
        <p className="card-text text-muted mb-2">
          ${product.price.toFixed(2)} / 庫存：{product.stock}
        </p>

        <Form.Group className="mb-2">
          <Form.Label className="mb-1">數量</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="success"
          className="mt-auto w-100"
          onClick={handleAddToCart}
          disabled={adding}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
        >
          {adding ? '加入中...' : '加入購物車'}
        </Button>
      </div>
    </div>
  );
}

export default CartEnabledProductCard;
