import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ModernProductCard({ product, mode = 'default', onDeleteFavorite, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleClick = () => {
    const id = product.id ?? product.productId;
    navigate(`/products/${id}`);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
  };

  const handleDeleteFavorite = () => {
    if (onDeleteFavorite) {
      onDeleteFavorite(product.productId);
    }
  };

  return (
    <div className="card h-100 shadow-sm rounded-3" style={{ overflow: 'hidden' }}>
      {product.productImage || product.imageUrl ? (
        <img
          src={product.productImage || product.imageUrl}
          alt={product.productName || product.name || '商品圖片'}
          className="card-img-top"
          style={{ objectFit: 'cover', height: '180px', cursor: 'pointer' }}
          onClick={handleClick}
        />
      ) : (
        <div
          className="bg-secondary text-white d-flex align-items-center justify-content-center"
          style={{ height: '180px', cursor: 'pointer' }}
          onClick={handleClick}
        >
          無圖片
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5
          className="card-title"
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          {product.productName || product.name || '無商品名稱'}
        </h5>

        {mode !== 'viewed' && (
          <p className="card-text mb-2 text-primary fw-bold">
            NT${product.price ? product.price.toFixed(2) : '0.00'}
          </p>
        )}

        {product.categoryName && (
          <p className="card-text text-muted mb-2">分類：{product.categoryName}</p>
        )}

        {mode === 'cart' && (
          <>
            <div className="input-group mb-2">
              <input
                type="number"
                min="1"
                max={product.stock || 99}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="form-control"
              />
              <span className="input-group-text">件</span>
            </div>
            <button className="btn btn-success mt-auto" onClick={handleAddToCart}>
              加入購物車
            </button>
          </>
        )}

        {mode === 'favorite' && (
          <button className="btn btn-danger mt-auto" onClick={handleDeleteFavorite}>
            取消收藏
          </button>
        )}

        {mode === 'viewed' && (
          <p className="card-text text-muted mb-2 mt-auto">
            最近瀏覽：{new Date(product.viewedAt).toLocaleString()}
          </p>
        )}

        {(mode === 'viewed' || mode === 'default') && (
          <button className="btn btn-outline-primary mt-auto" onClick={handleClick}>
            查看詳情
          </button>
        )}
      </div>
    </div>
  );
}

export default ModernProductCard;
