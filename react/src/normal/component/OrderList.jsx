import React, { useState } from "react";
import { Card, ListGroup, Button, Form } from "react-bootstrap";

const OrderList = ({ orders, onSelect, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 過濾：根據搜尋字串篩選出符合條件的訂單
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.date.includes(searchTerm) ||
    order.status.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentOrders = filteredOrders.slice(startIdx, startIdx + pageSize);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 搜尋時自動跳回第 1 頁
  };

  return (
    <div>
      <h2 className="mb-3">我的訂單</h2>

      <Form.Control
        type="text"
        placeholder="搜尋訂單編號 / 日期 / 狀態"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-3"
      />

      <Card style={{ height: "400px", display: "flex", flexDirection: "column" }}>
        <ListGroup variant="flush" style={{ overflowY: "auto", flex: 1 }}>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <ListGroup.Item
                key={order.id}
                action
                onClick={() => onSelect(order)}
                className="d-flex flex-column"
              >
                <div><strong>訂單編號：</strong>{order.id}</div>
                <div><strong>日期：</strong>{order.date}</div>
                <div><strong>金額：</strong>${order.amount}</div>
                <div><strong>狀態：</strong>{order.status}</div>
              </ListGroup.Item>
            ))
          ) : (
            <div className="p-3 text-center text-muted">查無訂單</div>
          )}
        </ListGroup>

        <Card.Footer
          style={{
            padding: "5px",
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button variant="secondary" onClick={handlePrev} disabled={currentPage === 1}>
            上一頁
          </Button>
          <span>
            第 {currentPage} 頁 / 共 {totalPages || 1} 頁
          </span>
          <Button variant="secondary" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
            下一頁
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default OrderList;
