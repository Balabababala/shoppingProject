import React from "react";
import { Card, Button } from "react-bootstrap";

const NotificationDetail = ({ notification, onBack }) => {
  if (!notification) return null;

  return (
    <Card>
      <Card.Header>
        <Button variant="link" onClick={onBack}>
          ← 返回列表
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Title>{notification.type || "系統通知"}</Card.Title>
        <Card.Text>{notification.message}</Card.Text>
        <Card.Text className="text-muted">
          狀態：{notification.status}｜建立時間：{new Date(notification.created_at).toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default NotificationDetail;
