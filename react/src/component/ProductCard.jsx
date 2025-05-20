import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const goToDetailPage = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card style={{ width: '18rem', cursor: 'pointer' }} className="m-2" onClick={goToDetailPage}>
      <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <h5>${product.price}</h5>
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation(); // 防止點按按鈕也觸發整張卡片跳轉
            onAddToCart(product);
          }}
        >
          加入購物車
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
