import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import NotificationList from "../NotificationList";
import NotificationDetail from "../NotificationDetail";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // 假資料
      const mockData = [
        {
          id: 1,
          message: "您的訂單已發貨。",
          status: "PENDING",
          created_at: "2025-05-08T12:00:00"
        },
        {
          id: 2,
          message: "系統將進行維護，請稍後再試。",
          status: "READ",
          created_at: "2025-05-07T10:00:00"
        },
        {
          id: 3,
          message: "您有新的留言。",
          status: "PENDING",
          created_at: "2025-05-06T14:30:00"
        }
      ];

      setNotifications(mockData);
      setLoading(false);
    } catch (error) {
      setError("無法載入通知");
      setLoading(false);
    }
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
          <NotificationList notifications={notifications} onSelect={setSelectedNotif} />
        </>
      ) : (
        <NotificationDetail notification={selectedNotif} onBack={() => setSelectedNotif(null)} />
      )}
    </Container>
  );
};

export default Notifications;
