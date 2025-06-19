import React, { useContext, useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

const PAGE_SIZE = 20;

export default function AdminBrowseHistoryPage() {
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  
  const [browseHistories, setBrowseHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');

  useEffect(() => {
    async function fetchBrowseHistory() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchWithAuthCheck(`${API_BASE}/admin/history/browse`);
        setBrowseHistories(resp.data || []);
      } catch (err) {
        setError(err.message);
        addToastMessage({ type: 'danger', text: `讀取瀏覽紀錄失敗：${err.message}` });
      } finally {
        setLoading(false);
      }
    }
    fetchBrowseHistory();
  }, [API_BASE, fetchWithAuthCheck, addToastMessage]);

  // 前端過濾搜尋
  const filteredHistories = browseHistories.filter(item => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return true;
    return (
      (item.username && item.username.toLowerCase().includes(kw)) ||
      (item.productName && item.productName.toLowerCase().includes(kw))
    );
  });

  // 計算分頁資料
  const totalPage = Math.max(1, Math.ceil(filteredHistories.length / PAGE_SIZE));
  const pageHistories = filteredHistories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 清除搜尋
  const clearSearch = () => {
    setSearchKeyword('');
    setCurrentPage(1);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">最近瀏覽商品紀錄</h3>

      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Control
          placeholder="搜尋使用者或商品名稱"
          value={searchKeyword}
          onChange={e => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') e.preventDefault();
          }}
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
                <th>使用者名稱</th>
                <th>商品名稱</th>
                <th>瀏覽時間</th>
              </tr>
            </thead>
            <tbody>
              {pageHistories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    目前尚無符合條件的瀏覽紀錄
                  </td>
                </tr>
              ) : (
                pageHistories.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.productName}</td>
                    <td>{new Date(item.viewedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* 分頁控制 */}
          <div
            className="d-flex justify-content-center align-items-center gap-3 mt-3"
            aria-label="最近瀏覽紀錄分頁"
          >
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
