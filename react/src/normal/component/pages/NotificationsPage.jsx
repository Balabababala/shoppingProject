import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);  // 加入 loading 狀態
  const [error, setError] = useState(null);     // 加入 error 狀態

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");

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

      console.log("Notifications fetched:", mockData);
      setNotifications(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError("無法載入通知");
      setLoading(false);
    }
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>通知中心</h2>
      {notifications.length === 0 ? (
        <p>目前沒有通知。</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginTop: "1rem",
              borderRadius: "8px",
            }}
          >
            <p><strong>{notif.type || "系統通知"}</strong></p>
            <p>{notif.message}</p>
            <p style={{ color: "gray" }}>
              狀態：{notif.status}｜建立時間：
              {new Date(notif.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
