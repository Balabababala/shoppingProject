import React, { useContext } from "react";
import { Container, Row, Col, Button, Image, Card } from "react-bootstrap";
import { AppContext } from '../../contexts/AppContext';
import { Link } from "react-router-dom";  
import "../../css/CartPage.css";

function CartPage() {
  const { cartItems, setCartItems } = useContext(AppContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">購物車</h2>

      {cartItems.length === 0 ? (
        <p>您的購物車是空的。</p>
      ) : (
        <>
          <Row className="g-3">
            {cartItems.map((item) => (
              <Col key={item.id} xs={12}>
                <Card className="position-relative">
                  <Row className="g-0 align-items-center">
                    <Col xs={3} md={2}>
                      <Link to={`/products/${item.id}`}>
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fluid
                          rounded
                          style={{ cursor: "pointer" }}
                        />
                      </Link>
                    </Col>
                    <Col xs={9} md={8}>
                      <Card.Body>
                        <Card.Title>
                          <Link 
                            to={`/products/${item.id}`} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {item.productName}
                          </Link>
                        </Card.Title>
                        <Card.Text>單價: ${item.price}</Card.Text>
                        <Card.Text>數量: {item.quantity}</Card.Text>
                        <Card.Text>
                          小計: ${item.price * item.quantity}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                    <Col xs={12} md={2} className="text-end pe-3">
                      <Button
                        variant="danger"
                        onClick={() => removeItem(item.id)}
                      >
                        刪除
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="mt-4">
            <Col xs={12} md={{ span: 4, offset: 8 }}>
              <Card className="p-3">
                <h4>結帳</h4>
                <div className="d-flex justify-content-between mb-3">
                  <span>總計</span>
                  <span>${totalPrice}</span>
                </div>
                <Button variant="primary" className="w-100">
                  結帳
                </Button>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default CartPage;
