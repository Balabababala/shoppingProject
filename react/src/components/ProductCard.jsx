import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const goToDetailPage = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    if (quantity < 1) return;
    onAddToCart({ ...product, quantity });
  };

  return (
    <Card style={{ width: '18rem' }} className="m-2">
      <Card.Img
        variant="top"
        src={product.imageUrl || 'https://via.placeholder.com/286x180?text=No+Image'}
        alt={product.name}
        style={{ objectFit: 'cover', height: '180px', cursor: 'pointer' }}
        onClick={goToDetailPage}
      />

      <Card.Body>
        <Card.Title
          style={{ cursor: 'pointer' }}
          onClick={goToDetailPage}
        >
          {product.name}
        </Card.Title>

        <Card.Text className="text-truncate" style={{ maxHeight: '3rem' }}>
          {product.description}
        </Card.Text>

        {product.sellerUserDto?.username && (
          <Card.Text className="text-muted small">
            賣家：{product.sellerUserDto.username}
          </Card.Text>
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

        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          加入購物車
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
