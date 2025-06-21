import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Spinner, Container, Form, InputGroup } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

export default function AdminReviewManagePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 10;

  const { addToastMessage, API_BASE, fetchWithAuthCheck } = useContext(AdminAppContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const result = await fetchWithAuthCheck(`${API_BASE}/admin/reviews`);
      if (!result || result.authError) return; // 已自動登出
      setReviews(result.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('取得評論失敗', err);
      addToastMessage('取得評論失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(reviews.length / pageSize);
  const pagedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  const toggleVisibility = async (reviewId, currentVisible) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isVisible: !currentVisible } : r))
    );

    const result = await fetchWithAuthCheck(
      `${API_BASE}/admin/reviews/${reviewId}/visibility?visible=${!currentVisible}`,
      { method: 'PATCH' }
    );
    if (!result || result.authError) return;

    if (result.status === 'error') {
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

    const result = await fetchWithAuthCheck(
      `${API_BASE}/admin/reviews/${reviewId}/approve?approved=${!currentApproved}`,
      { method: 'PATCH' }
    );
    if (!result || result.authError) return;

    if (result.status === 'error') {
      addToastMessage('切換審核狀態失敗');
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isApproved: currentApproved } : r))
      );
    } else {
      fetchReviews();
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('確定要刪除這則評論？')) return;
    setLoading(true);

    const result = await fetchWithAuthCheck(`${API_BASE}/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (!result || result.authError) {
      setLoading(false);
      return;
    }

    if (result.status === 'success') {
      await fetchReviews();
      addToastMessage('刪除成功');
    } else {
      addToastMessage('刪除失敗，請稍後再試');
    }

    setLoading(false);
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

          <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              上一頁
            </Button>

            <InputGroup style={{ width: '150px' }}>
              <Form.Control
                type="number"
                min="1"
                max={totalPages}
                value={inputPage}
                placeholder={String(currentPage)}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const pageNum = Number(inputPage);
                    if (!isNaN(pageNum)) changePage(pageNum);
                    setInputPage('');
                  }
                }}
              />
              <InputGroup.Text>/ {totalPages} 頁</InputGroup.Text>
            </InputGroup>

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
