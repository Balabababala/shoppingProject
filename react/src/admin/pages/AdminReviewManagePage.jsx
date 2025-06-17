import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Spinner, Container, Form } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

export default function AdminReviewManagePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 分頁相關狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 10; // 一頁顯示多少筆

  const { addToastMessage, API_BASE } = useContext(AdminAppContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reviews`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setReviews(result.data || []);
      setCurrentPage(1); // 載入新資料時回到第一頁
    } catch (err) {
      console.error('取得評論失敗', err);
      addToastMessage('取得評論失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 分頁計算
  const totalPages = Math.ceil(reviews.length / pageSize);
  const pagedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 分頁切換
  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  // 以下保持你原本的 toggleVisibility、toggleApproval、deleteReview 不變
  const toggleVisibility = async (reviewId, currentVisible) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isVisible: !currentVisible } : r))
    );

    try {
      const res = await fetch(
        `${API_BASE}/admin/reviews/${reviewId}/visibility?visible=${!currentVisible}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error('切換可見失敗', err);
      addToastMessage('切換可見狀態失敗');

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isVisible: currentVisible } : r))
      );
    }
  };

  const toggleApproval = async (reviewId, currentApproved) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved: !currentApproved } : r))
    );

    try {
      const res = await fetch(
        `${API_BASE}/admin/reviews/${reviewId}/approve?approved=${!currentApproved}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      await fetchReviews();
    } catch (err) {
      console.error('切換審核失敗', err);
      addToastMessage('切換審核狀態失敗');

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isApproved: currentApproved } : r))
      );
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('確定要刪除這則評論？')) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      await fetchReviews();
      addToastMessage('刪除成功');
    } catch (err) {
      console.error('刪除失敗', err);
      addToastMessage('刪除失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2>評論管理</h2>
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>商品ID</th>
                <th>使用者ID</th>
                <th>評分</th>
                <th>評論</th>
                <th>可見</th>
                <th>審核</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    無評論資料
                  </td>
                </tr>
              ) : (
                pagedReviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.productId}</td>
                    <td>{r.userId}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        checked={r.isVisible}
                        onChange={() => toggleVisibility(r.id, r.isVisible)}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        checked={r.isApproved}
                        onChange={() => toggleApproval(r.id, r.isApproved)}
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteReview(r.id)}
                        disabled={loading}
                      >
                        刪除
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* 分頁控制 */}
          <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              上一頁
            </Button>

            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              placeholder={currentPage}
              style={{
                width: '4.5rem',
                textAlign: 'center',
                borderRadius: '0.375rem',
                border: '1px solid #ced4da',
                outlineOffset: 0,
                outlineColor: '#80bdff',
                outlineStyle: 'auto',
                outlineWidth: 1,
              }}
              onChange={(e) => setInputPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const pageNum = Number(inputPage);
                  if (!isNaN(pageNum)) changePage(pageNum);
                  setInputPage('');
                }
              }}
            />

            <span style={{ userSelect: 'none' }}>
              / {totalPages} 頁
            </span>

            <Button
              variant="outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              下一頁
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
