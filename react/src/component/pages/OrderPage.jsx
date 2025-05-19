import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { mockOrders } from "../data/mockOrders";
import OrderList from "../OrderList.jsx";
import OrderDetail from "../OrderDetail.jsx";

const OrderPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          {!selectedOrder ? (
            <OrderList orders={mockOrders} onSelect={setSelectedOrder} />
          ) : (
            <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
