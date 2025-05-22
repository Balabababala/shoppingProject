import React, { useState } from "react";
import { ListGroup, Button, ButtonGroup } from "react-bootstrap";

const NotificationList = ({ notifications, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const currentNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (notifications.length === 0) {
    return <div>目前沒有通知。</div>;
  }

  return (
    <>
      <ListGroup>
        {currentNotifications.map((notif) => (
          <ListGroup.Item
            action
            key={notif.id}
            onClick={() => onSelect(notif)}
          >
            <strong>{notif.type || "系統通知"}</strong> - {notif.message}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* 分頁按鈕 */}
      {totalPages > 1 && (
        <ButtonGroup className="mt-3" aria-label="Notification pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx + 1}
              variant={currentPage === idx + 1 ? "primary" : "outline-primary"}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </>
  );
};

export default NotificationList;
