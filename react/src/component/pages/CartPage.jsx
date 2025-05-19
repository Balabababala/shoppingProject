import React, { useState } from "react";
import { Container, Row, Col, Button, Image, Card } from "react-bootstrap";
import "../../css/CartPage.css"; // 你的專屬 CSS 還是可以保留

function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "測試商品1",
      price: 199,
      quantity: 1,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "測試商品2",
      price: 299,
      quantity: 2,
      imageUrl: "https://via.placeholder.com/150",
    },
  ]);

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
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col xs={9} md={8}>
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
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
