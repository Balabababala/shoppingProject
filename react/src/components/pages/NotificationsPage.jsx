import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert, ListGroup, Button, Card, Badge } from "react-bootstrap";

const Notifications = () => {
  const BASE_API = 'http://localhost:8080/api';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    fetch(`${BASE_API}/notification`, {
      method: 'GET',
      headers: {},
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('找不到通知');
        return res.json();
      })
      .then(data => {
        setNotifications(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE_API}/notification/${id}`, {
        method: 'POST',
        headers: {},
        credentials: 'include',
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, status: 'READ' } : notif
        )
      );
    } catch (error) {
      console.error('標記為已讀失敗', error);
    }
  };

  const handleSelectNotification = async (notif) => {
    if (notif.status !== 'READ' && notif.status !== 'ARCHIVED') {
      await markAsRead(notif.id);
    }
    setSelectedNotif({ ...notif, status: notif.status === 'ARCHIVED' ? 'ARCHIVED' : 'READ' });
  };

  if (loading) return (
    <Container className="text-center mt-4">
      <Spinner animation="border" role="status" />
      <div>載入中...</div>
    </Container>
  );

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="mt-4">
      {!selectedNotif ? (
        <>
          <h2 className="mb-4">通知中心</h2>
          {notifications.length === 0 ? (
            <Alert variant="info">目前沒有通知。</Alert>
          ) : (
            <ListGroup>
              {notifications.map((notif) => (
                <ListGroup.Item
                  key={notif.id}
                  action
                  onClick={() => handleSelectNotification(notif)}
                >
                  <div className="fw-bold">
                    {notif.type || <span className="text-muted">[無類型]</span>}{" "}
                    {notif.status === "READ" && <Badge bg="success">已讀</Badge>}
                    {notif.status === "PENDING" && <Badge bg="warning">待處理</Badge>}
                    {notif.status === "ARCHIVED" && <Badge bg="secondary">已封存</Badge>}
                  </div>
                  <div>{notif.message}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      ) : (
        <>
          <Button variant="secondary" onClick={() => setSelectedNotif(null)} className="mb-3">
            返回列表
          </Button>
          <Card>
            <Card.Body>
              <Card.Title>通知詳情</Card.Title>
              <Card.Text><strong>類型:</strong> {selectedNotif.type || "[無類型]"}</Card.Text>
              <Card.Text><strong>內容:</strong> {selectedNotif.message}</Card.Text>
              <Card.Text>
                <strong>狀態:</strong>{" "}
                {selectedNotif.status === "READ" && <Badge bg="success">已讀</Badge>}
                {selectedNotif.status === "PENDING" && <Badge bg="warning">待處理</Badge>}
                {selectedNotif.status === "ARCHIVED" && <Badge bg="secondary">已封存</Badge>}
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Notifications;
