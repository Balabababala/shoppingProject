import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

export default function AdminOrderEditPage() {
  const { orderId } = useParams();
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 編輯欄位（依實際訂單欄位調整）
  const [orderStatus, setOrderStatus] = useState('');
  const [notes, setNotes] = useState(''); // 假設有備註欄位

  const fetchOrder = async () => {
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
        setOrderStatus(res.data.orderStatus || '');
        setNotes(res.data.notes || ''); // 若有備註
      } else {
        addToastMessage('讀取訂單資料失敗');
      }
    } catch (error) {
      addToastMessage('取得訂單詳細資料錯誤：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus,
          notes,
        }),
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        navigate('/login');
      } else if (res?.success) {
        addToastMessage('訂單更新成功');
        navigate('/admin/orders'); // 回訂單列表頁，或其他頁面
      } else {
        addToastMessage('訂單更新失敗：' + (res.message || '未知錯誤'));
      }
    } catch (error) {
      addToastMessage('更新訂單錯誤：' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-3"><Spinner animation="border" /></div>;
  }

  if (!order) {
    return <Alert variant="danger" className="text-center">找不到訂單資料</Alert>;
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>訂單編輯 - {order.orderNumber}</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>買家名稱</Form.Label>
          <Form.Control type="text" value={order.buyerName} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>賣家名稱</Form.Label>
          <Form.Control type="text" value={order.sellerName} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>訂單日期</Form.Label>
          <Form.Control type="text" value={new Date(order.orderDate).toLocaleString()} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>訂單狀態</Form.Label>
          <Form.Select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
            <option value="">請選擇狀態</option>
            <option value="PENDING">待處理</option>
            <option value="PROCESSING">處理中</option>
            <option value="SHIPPED">已出貨</option>
            <option value="COMPLETED">已完成</option>
            <option value="CANCELLED">已取消</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>備註</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? '儲存中...' : '儲存'}
        </Button>{' '}
        <Button variant="secondary" onClick={() => navigate(-1)} disabled={saving}>
          取消
        </Button>
      </Form>
    </div>
  );
}
