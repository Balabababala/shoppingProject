import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminNotificationNewPage() {
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const ALL_USERS_OPTION = { value: null, label: '全站通知（所有使用者）' };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const resp = await fetchWithAuthCheck(`${API_BASE}/admin/users`);
        if (resp?.data) {
          // 確保 users 有 id 和 username
          setUsers(resp.data);
        } else {
          addToastMessage('取得使用者清單失敗');
        }
      } catch (error) {
        addToastMessage('取得使用者清單錯誤');
      }
    }
    fetchUsers();
  }, [API_BASE, fetchWithAuthCheck, addToastMessage]);

  // 確保 select 的 value 不是 null，react-select 要用 null 或 undefined 代表沒選擇。
  // 這裡也可以用空字串，但 react-select 用 null 比較安全。
  const handleUserChange = (selectedOption) => {
    // console.log('selected user:', selectedOption);
    setSelectedUser(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!type.trim() || !message.trim() || selectedUser === null) {
      setError('請輸入完整欄位並選擇使用者或全站通知');
      return;
    }

    const payload = {
      type: type.trim(),
      message: message.trim(),
      status,
      userId: selectedUser.value, // null 表示全站通知
    };
    console.log('送出 payload:', payload);

    try {
      setSubmitting(true);
      const resp = await fetchWithAuthCheck(`${API_BASE}/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp && resp.message) {
        addToastMessage(resp.message);
        navigate('/admin/notifications');
      } else {
        setError('新增失敗');
      }
    } catch (err) {
      console.error(err);
      setError('發送通知失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const userOptions = [ALL_USERS_OPTION, ...users.map(u => ({
    value: u.userId,     // 確保這是 Number 或 String，不要是 null 或 undefined
    label: u.username || `使用者#${u.userId}`,
  }))];

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h3 className="mb-4">新增通知</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>通知類型</Form.Label>
          <Form.Control
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            placeholder="例如：系統公告 / 提醒"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>通知內容</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>狀態</Form.Label>
          <Form.Select
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="PENDING">未讀</option>
            <option value="READ">已讀</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>選擇使用者或全站通知</Form.Label>
          <Select
            options={userOptions}
            value={selectedUser}
            onChange={handleUserChange}
            placeholder="請選擇使用者或全站通知"
            isSearchable
            // 你也可以加 key 屬性，但 react-select 本身會處理
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? '送出中...' : '送出通知'}
        </Button>
      </Form>
    </Container>
  );
}
