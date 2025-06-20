import React, { useEffect, useState, useContext } from "react";
import { Container, Spinner, Alert, ListGroup, Button, Card, Badge } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";

const Notifications = () => {
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const result = await fetchWithAuthCheck(`${API_BASE}/notification`);
    if (result?.authError) {
      setError("請先登入以查看通知");
    } else if (result?.data) {
      setNotifications(result.data);
    } else {
      setError("載入通知失敗");
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    const result = await fetchWithAuthCheck(`${API_BASE}/notification/${id}`, {
      method: "POST",
    });

    if (result?.authError) {
      addToastMessage("請先登入才能標記通知");
      return false;
    }

    if (result?.error) {
      addToastMessage(result.message || "標記通知失敗");
      return false;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
    );
    return true;
  };

  const handleSelectNotification = async (notif) => {
    let newStatus = notif.status;

    if (notif.status !== "READ" && notif.status !== "ARCHIVED") {
      const success = await markAsRead(notif.id);
      if (success) newStatus = "READ";
    }

    setSelectedNotif({ ...notif, status: newStatus });
  };

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" role="status" />
        <div>載入中...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

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
                    {notif.isGlobal ? (
                      <span className="text-primary me-2">🔔【系統公告】</span>
                    ) : (
                      notif.type || <span className="text-muted">[無類型]</span>
                    )}{" "}
                    {/* 系統公告不顯示標籤 */}
                    {!notif.isGlobal && notif.status === "READ" && <Badge bg="success">已讀</Badge>}
                    {!notif.isGlobal && notif.status === "PENDING" && <Badge bg="warning">待處理</Badge>}
                    {!notif.isGlobal && notif.status === "ARCHIVED" && <Badge bg="secondary">已封存</Badge>}
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
              <Card.Text>
                <strong>類型:</strong>{" "}
                {selectedNotif.isGlobal
                  ? "【系統公告】"
                  : selectedNotif.type || "[無類型]"}
              </Card.Text>
              <Card.Text><strong>內容:</strong> {selectedNotif.message}</Card.Text>
               <Card.Text>
                <strong>狀態:</strong>{" "}
                {!selectedNotif.isGlobal && selectedNotif.status === "READ" && (
                  <Badge bg="success">已讀</Badge>
                )}
                {!selectedNotif.isGlobal && selectedNotif.status === "PENDING" && (
                  <Badge bg="warning">待處理</Badge>
                )}
                {!selectedNotif.isGlobal && selectedNotif.status === "ARCHIVED" && (
                  <Badge bg="secondary">已封存</Badge>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Notifications;
