import React from 'react';
import { Link } from 'react-router-dom';
import BaseProductCard from './BaseProductCard';

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="text-decoration-none text-dark"
    >
      <BaseProductCard product={product}>
        <p className="card-text text-truncate">{product.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="text-muted">庫存: {product.stock}</span>
        </div>
      </BaseProductCard>
    </Link>
  );
}

export default ProductCard;
