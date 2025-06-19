import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Table } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuthCheck(`${API_BASE}/admin/orders/${orderId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res?.authError) {
          addToastMessage('身份驗證失效，請重新登入');
          navigate('/login');
          return;
        }
        if (res?.data) {
          setOrder(res.data);
        } else {
          addToastMessage('讀取訂單資料失敗');
        }
      } catch (error) {
        addToastMessage('取得訂單詳細資料錯誤：' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        查無訂單資料
        <div>
          <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginTop: 10 }}>
            返回
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>訂單詳細資料 - {order.orderNumber}</h2>
      <Table bordered>
        <tbody>
          <tr><th>訂單編號</th><td>{order.orderNumber}</td></tr>
          <tr><th>買家名稱</th><td>{order.buyerName}</td></tr>
          <tr><th>賣家名稱</th><td>{order.sellerName}</td></tr>
          <tr><th>訂單日期</th><td>{new Date(order.orderDate).toLocaleString()}</td></tr>
          <tr><th>訂單狀態</th><td>{order.orderStatus}</td></tr>
          <tr><th>付款狀態</th><td>{order.paymentStatus}</td></tr>
          <tr><th>物流狀態</th><td>{order.shipmentStatus}</td></tr>
          <tr><th>付款方式</th><td>{order.paymentMethod}</td></tr>
          <tr><th>配送方式</th><td>{order.shippingMethod}</td></tr>
          <tr><th>追蹤編號</th><td>{order.trackingNumber}</td></tr>
          <tr><th>收件人</th><td>{order.receiverName}</td></tr>
          <tr><th>收件人電話</th><td>{order.receiverPhone}</td></tr>
          <tr><th>配送地址</th><td>{order.shippingAddress}</td></tr>
          <tr><th>備註</th><td>{order.notes || '無'}</td></tr>
          <tr><th>總金額</th><td>${order.totalAmount.toFixed(2)}</td></tr>
          <tr><th>建立時間</th><td>{new Date(order.createdAt).toLocaleString()}</td></tr>
          <tr><th>更新時間</th><td>{new Date(order.updatedAt).toLocaleString()}</td></tr>
        </tbody>
      </Table>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回訂單列表
        </Button>
        <Button variant="primary" onClick={() => navigate(`/admin/order-edit/${order.id}`)}>
          編輯
        </Button>
      </div>
    </div>
  );
}
