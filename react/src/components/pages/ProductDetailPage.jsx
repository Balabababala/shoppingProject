import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Container, Spinner, Alert, Badge } from 'react-bootstrap';

function ProductDetailPage() {
  const BASE_API = "http://localhost:8080/api";
  const { id } = useParams();  // 取得 URL 中的產品 ID
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_API}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("找不到商品");
        return res.json();
      })
      .then(data => {
        setProduct(data.data); // 假設 API 包在 data 屬性中
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    alert(`已加入購物車：${product.name}`);
  };

  const handleBack = () => {
    navigate(-1); // 返回上一頁
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={handleBack} className="mt-3">返回上一頁</Button>
      </Container>
    );
  }
return (
  <Container className="mt-5">
    <Button variant="link" onClick={handleBack} className="mb-3">
      &larr; 返回上一頁
    </Button>

    <Row className="g-4">
      <Col md={6} className="d-flex justify-content-center align-items-center">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image'}
          alt={product.name}
          className="img-fluid rounded shadow-sm border"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
      </Col>

      <Col md={6}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h2 className="fw-bold mb-3">{product.name}</h2>

            {/* 賣家資訊 */}
            {product.sellerUserDto?.username && (
              <div className="mb-3">
                <span className="text-muted">賣家：</span>
                <Badge bg="secondary" className="ms-1">{product.sellerUserDto.username}</Badge>
              </div>
            )}

            {/* 價格 */}
            <h4 className="text-danger fw-semibold mb-3">
              NT$ {product.price.toLocaleString()}
            </h4>

            {/* 庫存狀態 */}
            {typeof product.stock === 'number' && (
              <div className="mb-3">
                <span className="me-2">庫存：</span>
                {product.stock > 0 ? (
                  <Badge bg="success">有貨（{product.stock}）</Badge>
                ) : (
                  <Badge bg="danger">缺貨</Badge>
                )}
              </div>
            )}

            {/* 商品描述 */}
            <Card.Text style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#444' }} className="mb-4">
              {product.description}
            </Card.Text>

            <div className="d-grid">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? '缺貨中' : '加入購物車'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

}

export default ProductDetailPage;
