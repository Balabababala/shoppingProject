// BaseProductCard.jsx
import React from 'react';

function BaseProductCard({ product, children }) {
  return (
    <div className="card h-100 shadow-sm rounded-3" style={{ overflow: 'hidden' }}>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.name || product.productName}
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
        <h5 className="card-title">{product.name || product.productName}</h5>
        <p className="card-text mb-2">NT${product.price.toFixed(2)}</p>
        {children}
      </div>
    </div>
  );
}

export default BaseProductCard;
