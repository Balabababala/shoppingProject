// AdminDashboard.jsx
import React from 'react';

function AdminDashboard() {
  // 模擬靜態數據
  const orderCount = 123;
  const salesAmount = 45678;
  const notifications = [
    { id: 1, message: '支付失敗：訂單 #1234', read: false },
    { id: 2, message: '庫存不足：商品 A', read: true },
    { id: 3, message: '退貨申請：訂單 #5678', read: false },
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>儀表板</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>系統概況</h3>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
            <h4>訂單數</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orderCount}</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '1rem', flex: 1 }}>
            <h4>銷售額</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>NT${salesAmount.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section>
        <h3>通知中心</h3>
        <ul>
          {notifications.map((note) => (
            <li
              key={note.id}
              style={{
                textDecoration: note.read ? 'line-through' : 'none',
                color: note.read ? 'gray' : 'black',
                cursor: 'pointer',
                marginBottom: '0.5rem',
              }}
              onClick={() => alert(`標記通知已讀：${note.message}`)}
            >
              {note.message}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
