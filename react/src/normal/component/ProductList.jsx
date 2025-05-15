import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ProductList.css';

function ProductList({ products }) {
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  console.log("Products:", JSON.stringify(products, null, 2));

  return (
    <div className="row">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div
              className="card h-100 shadow-sm product-card"
              onClick={() => goToDetail(product.id)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.name}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">價格：${product.price}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>目前沒有產品。</p>
      )}
    </div>
  );
}

export default ProductList;
