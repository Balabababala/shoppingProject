import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

const product = {
  id: 101,
  name: '超讚電競滑鼠',
  price: 1299,
  description: '這是一款高效能、人體工學設計的電競滑鼠，適合長時間使用。',
  image: 'https://via.placeholder.com/300x200.png?text=Product+Image',
};

function ProductDetailPage() {
  const handleAddToCart = () => {
    alert(`已加入購物車：${product.name}`);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-fluid" />
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text><strong>價格：</strong>${product.price}</Card.Text>
              <Card.Text>{product.description}</Card.Text>
              <Button variant="primary" onClick={handleAddToCart}>
                加入購物車
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;
