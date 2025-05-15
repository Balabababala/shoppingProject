import React, { useState } from 'react';
import '../../css/CartPage.css';  // 它專屬的css

function CartPage() {
  const [cartItems, setCartItems] = useState([      // 假設這是你的購物車內容
    {
      id: 1,
      name: '測試商品1',
      price: 199,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: '測試商品2',
      price: 299,
      quantity: 2,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]);

  // 計算總價
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 移除商品
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="container py-5">
      <h2>購物車</h2>
      {cartItems.length === 0 ? (
        <p>您的購物車是空的。</p>
      ) : (
        <div className="row">
          {/* 商品列表 */}
          <div className="col-12">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                <div className="ms-3">
                  <h5>{item.name}</h5>
                  <p>單價: ${item.price}</p>
                  <div className="d-flex align-items-center">
                    <p>數量: {item.quantity}</p>
                  </div>
                  <p>小計: ${item.price * item.quantity}</p>
                </div>
                {/* 刪除按鈕放在右下角 */}
                <button
                  className="btn btn-danger remove-btn position-absolute bottom-0 end-0"
                  onClick={() => removeItem(item.id)}
                >
                  刪除
                </button>
              </div>
            ))}
          </div>

          {/* 結帳區域 */}
          <div className="col-12 mt-4">
            <div className="checkout-section p-3 border rounded">
              <h4>結帳</h4>
              <div className="d-flex justify-content-between">
                <span>總計</span>
                <span>${totalPrice}</span>
              </div>
              <button className="btn btn-primary w-100 mt-3">結帳</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
