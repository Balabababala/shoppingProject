import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Table, Pagination, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminAppContext } from '../contexts/AdminAppContext';

const PAGE_SIZE = 10;

export default function AdminOrderPage() {
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const navigate = useNavigate();

  // 查詢參數
  const [orderIdKeyword, setOrderIdKeyword] = useState('');
  const [userNameKeyword, setUserNameKeyword] = useState('');

  // 全部訂單資料（不分頁）
  const [orders, setOrders] = useState([]);
  // 分頁目前頁數
  const [currentPage, setCurrentPage] = useState(1);

  const [inputPage, setInputPage] = useState(''); //分頁輸入用

  // 載入狀態
  const [loading, setLoading] = useState(false);

  // 取得全部符合條件的訂單（無分頁）
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (orderIdKeyword.trim()) params.append('orderNumber', orderIdKeyword.trim());
      if (userNameKeyword.trim()) params.append('userName', userNameKeyword.trim());

      const res = await fetchWithAuthCheck(`${API_BASE}/admin/orders/search?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.data) {
        setOrders(res.data);
        setCurrentPage(1);
      } else {
        addToastMessage('查詢訂單失敗');
      }
    } catch (error) {
      addToastMessage('查詢訂單時發生錯誤：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 頁面載入時先查一次
  useEffect(() => {
    fetchOrders();
  }, []);

  // 依照 currentPage 計算要顯示哪幾筆訂單（前端分頁）
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  // 計算總頁數
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  // 分頁按鈕產生
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: 20 }}>
      <h2>訂單紀錄查詢</h2>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders();
        }}
        style={{ marginBottom: 20 }}
      >
        <Form.Group className="mb-3" controlId="orderIdKeyword">
          <Form.Label>訂單編號關鍵字</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入訂單編號或部分文字"
            value={orderIdKeyword}
            onChange={(e) => setOrderIdKeyword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="userNameKeyword">
          <Form.Label>用戶名稱關鍵字</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入用戶名稱或部分文字"
            value={userNameKeyword}
            onChange={(e) => setUserNameKeyword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? '查詢中...' : '查詢'}
        </Button>
      </Form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spinner animation="border" />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666' }}>查無訂單資料</div>
      ) : (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>買家名稱</th>
                <th>賣家名稱</th>
                <th>訂單日期</th>
                <th>狀態</th>
                <th>總金額</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.buyerName}</td>
                  <td>{order.sellerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.orderStatus}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => navigate(`/admin/order/detail/${order.id}`)}
                    >
                      詳細
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

         <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
          <Button
            variant="outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            上一頁
          </Button>

          <Form.Control
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            placeholder={currentPage.toString()}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const pageNum = Number(inputPage);
                if (!isNaN(pageNum)) {
                  const target = Math.max(1, Math.min(totalPages, pageNum));
                  setCurrentPage(target);
                  setInputPage('');
                }
              }
            }}
            style={{ width: '4.5rem', textAlign: 'center' }}
          />

          <span style={{ userSelect: 'none' }}> / {totalPages} 頁</span>

          <Button
            variant="outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            下一頁
          </Button>
        </div>
        </>
      )}
    </div>
  );
}
