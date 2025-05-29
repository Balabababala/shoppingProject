import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const goToDetailPage = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // 防止觸發 goToDetailPage
    if (quantity < 1) return;
    onAddToCart({ ...product, quantity }); // 將數量一併傳出
  };

  return (
    <Card
      style={{ width: '18rem', cursor: 'pointer' }}
      className="m-2"
      onClick={goToDetailPage}
    >
      <Card.Img
        variant="top"
        src={product.imageUrl || 'https://via.placeholder.com/286x180?text=No+Image'}
        alt={product.name}
        style={{ objectFit: 'cover', height: '180px' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-truncate" style={{ maxHeight: '3rem' }}>
          {product.description}
        </Card.Text>

        {product.sellerUserDto?.username && (
          <Card.Text className="text-muted small">賣家：{product.sellerUserDto.username}</Card.Text>
        )}

        <h5>${product.price.toLocaleString()}</h5>

        <div className="d-flex align-items-center mb-2">
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: '4.5rem', marginRight: '0.5rem' }}
            onClick={(e) => e.stopPropagation()}
          />
          <span>件</span>
        </div>

        <Button variant="primary" onClick={handleAddToCart}>
          加入購物車
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
