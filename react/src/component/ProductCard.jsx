import { Card, Button } from 'react-bootstrap';


function ProductCard({ product, onAddToCart }) {
  return (
    <Card style={{ width: '18rem' }} className="m-2">
      <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          {product.description}
        </Card.Text>
        <h5>${product.price}</h5>
        <Button variant="primary" onClick={() => onAddToCart(product)}>
          加入購物車
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
