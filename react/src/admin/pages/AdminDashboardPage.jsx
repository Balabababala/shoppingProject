import React, { useState, useEffect, useContext } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminDashboard() {
  const { fetchWithAuthCheck, addToastMessage, API_BASE } = useContext(AdminAppContext);

  const [orderCount, setOrderCount] = useState(0);
  const [salesAmount, setSalesAmount] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, message: '支付失敗：訂單 #1234', read: false },
    { id: 2, message: '庫存不足：商品 A', read: true },
    { id: 3, message: '退貨申請：訂單 #5678', read: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetchWithAuthCheck(`${API_BASE}/admin/dashboard`);
        if (res?.data) {
          setOrderCount(res.data.orderCount || 0);
          setSalesAmount(res.data.totalSales || 0);
        } else {
          addToastMessage('讀取後台資料失敗');
        }
      } catch (error) {
        console.error('抓取 dashboard 失敗:', error);
        addToastMessage('抓取 dashboard 失敗');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [fetchWithAuthCheck, API_BASE, addToastMessage]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((note) => (note.id === id ? { ...note, read: true } : note))
    );
  };

  if (loading) {
    return (
      <div className="container py-4">
        <h2>儀表板</h2>
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2>儀表板</h2>

      <section className="mb-5">
        <h4>系統概況</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="border rounded p-3 text-center">
              <h5>訂單數</h5>
              <p className="fs-3 fw-bold">{orderCount}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 text-center">
              <h5>銷售額</h5>
              <p className="fs-3 fw-bold">NT${Number(salesAmount).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h4>通知中心</h4>
        <ul className="list-group">
          {notifications.map(({ id, message, read }) => (
            <li
              key={id}
              className={`list-group-item d-flex justify-content-between align-items-center ${read ? 'text-muted' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => markAsRead(id)}
            >
              <span>{message}</span>
              {!read && <span className="badge bg-danger">未讀</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
