import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

const OrderDetail = ({ order, onBack }) => {
  if (!order) return null;

  return (
    <Card className="mt-4 shadow">
      <Card.Header>
        <Button variant="link" onClick={onBack} className="p-0">
          ← 返回列表
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Title>訂單詳情 - {order.id}</Card.Title>
        <Card.Text>日期：{order.date}</Card.Text>
        <Card.Text>狀態：{order.status}</Card.Text>
        <Card.Text>總金額：${order.amount}</Card.Text>
        <hr />
        <ListGroup variant="flush">
          {order.items.map((item, index) => (
            <ListGroup.Item key={index}>
              {item.name} x {item.quantity} = ${item.price * item.quantity}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default OrderDetail;
