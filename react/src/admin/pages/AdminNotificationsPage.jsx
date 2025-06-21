import React, { useContext, useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

const PAGE_SIZE = 20;

export default function AdminNotificationsPage() {
  const { API_BASE, fetchWithAuthCheck, addToastMessage, adminUserData } = useContext(AdminAppContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');

  const fetchNotifications = async () => {
    if (!adminUserData?.user) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchWithAuthCheck(`${API_BASE}/admin/notifications/user`);
      if (resp?.data) {
        setNotifications(resp.data);
      } else {
        setNotifications([]);
        addToastMessage('取得通知失敗');
      }
    } catch (err) {
      setError(err.message);
      addToastMessage(`通知資料錯誤：${err.message}`);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [API_BASE, fetchWithAuthCheck, addToastMessage, adminUserData]);

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此通知嗎？')) return;
    try {
      await fetchWithAuthCheck(`${API_BASE}/admin/notifications/${id}`, {
        method: 'DELETE',
      });
      addToastMessage('刪除成功');
      fetchNotifications();
    } catch (err) {
      addToastMessage(`刪除失敗：${err.message}`);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return true;
    return (
      (n.message && n.message.toLowerCase().includes(kw)) ||
      (n.type && n.type.toLowerCase().includes(kw))
    );
  });

  const totalPage = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const pageNotifications = filteredNotifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const clearSearch = () => {
    setSearchKeyword('');
    setCurrentPage(1);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">通知管理</h3>

      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Control
          placeholder="搜尋通知訊息或類型"
          value={searchKeyword}
          onChange={e => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        />
        <Button variant="outline-secondary" onClick={clearSearch}>
          清除
        </Button>
      </InputGroup>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>類型</th>
                <th>訊息</th>
                <th>通知對象</th>
                <th>狀態</th>
                <th>建立時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {pageNotifications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    目前尚無符合條件的通知
                  </td>
                </tr>
              ) : (
                pageNotifications.map((n, index) => (
                  <tr key={n.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{n.type}</td>
                    <td>{n.message}</td>
                    <td>{n.userName || '全站通知'}</td>
                    <td>{n.status}</td>
                    <td>{new Date(n.createdAt).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(n.id)}
                      >
                        刪除
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-3" aria-label="通知紀錄分頁">
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
              max={totalPage}
              value={inputPage}
              placeholder={currentPage.toString()}
              onChange={e => setInputPage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const pageNum = Number(inputPage);
                  if (!isNaN(pageNum)) {
                    const target = Math.max(1, Math.min(totalPage, pageNum));
                    setCurrentPage(target);
                    setInputPage('');
                  }
                }
              }}
              style={{ width: '4.5rem', textAlign: 'center' }}
            />
            <span style={{ userSelect: 'none' }}> / {totalPage} 頁</span>

            <Button
              variant="outline-primary"
              disabled={currentPage === totalPage}
              onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
            >
              下一頁
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
