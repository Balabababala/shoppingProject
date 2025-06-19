import React, { useContext, useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

const PAGE_SIZE = 20;

export default function AdminSearchHistoryPage() {
  const { API_BASE, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(''); // 新增輸入框用

  useEffect(() => {
    const fetchSearchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuthCheck(`${API_BASE}/admin/search-history`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res?.authError) {
          addToastMessage('身份驗證失效，請重新登入');
          return;
        }
        if (res?.data) {
          setSearchHistories(res.data);
          setError('');
          setCurrentPage(1); // 重置頁碼
        } else {
          setError(res?.message || '讀取搜尋歷史資料失敗');
          addToastMessage(res?.message || '讀取搜尋歷史資料失敗');
        }
      } catch (error) {
        setError('取得搜尋歷史資料錯誤：' + error.message);
        addToastMessage('取得搜尋歷史資料錯誤：' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchHistory();
  }, [API_BASE, fetchWithAuthCheck, addToastMessage]);

  // 過濾搜尋紀錄
  const filteredHistories = searchHistories.filter(record => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return true;
    return (
      record.keyword?.toLowerCase().includes(kw) ||
      record.username?.toLowerCase().includes(kw)
    );
  });

  // 計算分頁資料
  const totalPage = Math.max(1, Math.ceil(filteredHistories.length / PAGE_SIZE));
  const pageHistories = filteredHistories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 清除搜尋關鍵字
  const clearSearch = () => {
    setSearchKeyword('');
    setCurrentPage(1);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">搜尋紀錄查詢</h3>

      <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Control
          placeholder="搜尋使用者名稱或關鍵字"
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
                <th>搜尋關鍵字</th>
                <th>搜尋時間</th>
              </tr>
            </thead>
            <tbody>
              {pageHistories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    目前尚無符合條件的搜尋紀錄
                  </td>
                </tr>
              ) : (
                pageHistories.map((record, index) => (
                  <tr key={record.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{record.username}</td>
                    <td>{record.keyword}</td>
                    <td>{new Date(record.searchedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* 分頁控制 */}
          <div
            className="d-flex justify-content-center align-items-center gap-3 mt-3"
            aria-label="搜尋紀錄分頁"
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
