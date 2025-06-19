import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

const ORDER_STATUSES = [
  'PENDING', 'PAID', 'SHIPPED', 'DELIVERED',
  'COMPLETED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'
];

const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const SHIPMENT_STATUSES = ['NOT_SHIPPED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNING'];

export default function AdminOrderEditPage() {
  const { orderId } = useParams();
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    orderStatus: '',
    paymentStatus: '',
    shipmentStatus: '',
    shippingMethod: '',
    paymentMethod: '',
    trackingNumber: '',
    receiverName: '',
    receiverPhone: '',
    shippingAddress: '',
    notes: '',
  });

  useEffect(() => {
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
          setFormData({
            orderStatus: res.data.orderStatus || '',
            paymentStatus: res.data.paymentStatus || '',
            shipmentStatus: res.data.shipmentStatus || '',
            shippingMethod: res.data.shippingMethod || '',
            paymentMethod: res.data.paymentMethod || '',
            trackingNumber: res.data.trackingNumber || '',
            receiverName: res.data.receiverName || '',
            receiverPhone: res.data.receiverPhone || '',
            shippingAddress: res.data.shippingAddress || '',
            notes: res.data.notes || '',
          });
        } else {
          addToastMessage('讀取訂單資料失敗');
        }
      } catch (error) {
        addToastMessage('取得訂單詳細資料錯誤：' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.orderStatus) {
      addToastMessage('請選擇訂單狀態');
      return;
    }

    setSaving(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
       console.log(res);
      if ((res?.message ?? '').includes("成功")) {
        addToastMessage('訂單更新成功');
        navigate(`/admin/order/detail/${orderId}`);
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
    <div style={{ maxWidth: 750, margin: 'auto', padding: 20 }}>
      <h2>訂單編輯 - {order.orderNumber}</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>訂單狀態</Form.Label>
          <Form.Select value={formData.orderStatus} onChange={e => handleChange('orderStatus', e.target.value)}>
            <option value="">請選擇</option>
            {ORDER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>付款狀態</Form.Label>
          <Form.Select value={formData.paymentStatus} onChange={e => handleChange('paymentStatus', e.target.value)}>
            <option value="">請選擇</option>
            {PAYMENT_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>物流狀態</Form.Label>
          <Form.Select value={formData.shipmentStatus} onChange={e => handleChange('shipmentStatus', e.target.value)}>
            <option value="">請選擇</option>
            {SHIPMENT_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>配送方式</Form.Label>
          <Form.Control type="text" value={formData.shippingMethod} onChange={e => handleChange('shippingMethod', e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>付款方式</Form.Label>
          <Form.Control type="text" value={formData.paymentMethod} onChange={e => handleChange('paymentMethod', e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>追蹤編號</Form.Label>
          <Form.Control type="text" value={formData.trackingNumber} onChange={e => handleChange('trackingNumber', e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>收件人姓名</Form.Label>
          <Form.Control type="text" value={formData.receiverName} onChange={e => handleChange('receiverName', e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>收件人電話</Form.Label>
          <Form.Control type="text" value={formData.receiverPhone} onChange={e => handleChange('receiverPhone', e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>配送地址</Form.Label>
          <Form.Control type="text" value={formData.shippingAddress} onChange={e => handleChange('shippingAddress', e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>備註</Form.Label>
          <Form.Control as="textarea" rows={3} value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)} disabled={saving}>返回</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? '儲存中...' : '儲存變更'}</Button>
        </div>
      </Form>
    </div>
  );
}
