import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Container, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';

function ProductDetailPage() {
  const BASE_API = "http://localhost:8080/api";
  const { id } = useParams();
  const navigate = useNavigate();

  const { userData, setCartItems, setToastMessage } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BASE_API}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("找不到商品");
        return res.json();
      })
      .then(data => {
        setProduct(data.data);
        setQuantity(1);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!userData) {
      setToastMessage("請先登入才能加入購物車！");
      navigate('/userlogin');
      return;
    }
    

    
    // 數量檢查，限制最小1，最大不超過庫存（如果有庫存限制）
    let qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (product.stock && qty > product.stock) qty = product.stock;

    fetch(`${BASE_API}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: userData.userId, productId: product.id, quantity: qty }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`加入購物車失敗，狀態碼:${res.status}`);
        return res.json();
      })
      .then(() => {
        setToastMessage(`已加入購物車：${product.name} x ${qty}`);
        // 更新購物車內容
        return fetch(`${BASE_API}/cart`, { credentials: 'include' });
      })
      .then(res => res.json())
      .then(data => {  
        if (!data || !data.data) {
        throw new Error("購物車資料格式錯誤");
        }
         setCartItems(data.data);
      })
      .catch(err => {
        setToastMessage(err.message);
      });
  };

  const handleBack = () => {
    navigate(-1);
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

              {product.sellerUserDto?.username && (
                <div className="mb-3">
                  <span className="text-muted">賣家：</span>
                  <Badge bg="secondary" className="ms-1">{product.sellerUserDto.username}</Badge>
                </div>
              )}

              <h4 className="text-danger fw-semibold mb-3">
                NT$ {product.price.toLocaleString()}
              </h4>

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

              <Form.Group className="mb-3" controlId="quantityInput">
                <Form.Label>數量</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={product.stock || 9999}
                  value={quantity}
                  onChange={(e) => {
                    let val = e.target.value;
                    // 只允許正整數
                    if (/^\d*$/.test(val)) {
                      setQuantity(val === '' ? '' : Number(val));
                    }
                  }}
                  disabled={product.stock === 0}
                  style={{ maxWidth: '120px' }}
                />
              </Form.Group>

              <Card.Text style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#444' }} className="mb-4">
                {product.description}
              </Card.Text>

              <div className="d-grid">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || quantity < 1 || quantity > product.stock}
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
