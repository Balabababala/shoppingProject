import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Spinner, Container, Form, InputGroup } from 'react-bootstrap';
import { AdminAppContext } from '../contexts/AdminAppContext';

export default function AdminReviewManagePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 10;

  const { addToastMessage, API_BASE, fetchWithAuthCheck } = useContext(AdminAppContext);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const result = await fetchWithAuthCheck(`${API_BASE}/admin/reviews?page=${page}&size=${pageSize}`);
      console.log('Fetch reviews result:', JSON.stringify(result, null, 2));
      if (!result || result.authError) {
        console.warn('Authentication error or no result returned');
        addToastMessage('請重新登入後台', 'danger');
        return;
      }
      if (!result.data) {
        console.warn('No data in response:', result);
        setReviews([]);
        setTotalPages(1);
        addToastMessage('未找到評論資料', 'warning');
        return;
      }
      const reviewsData = Array.isArray(result.data) ? result.data : result.data.content || [];
      setReviews(reviewsData);
      setTotalPages(result.data.totalPages || Math.ceil(reviewsData.length / pageSize) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('取得評論失敗:', err);
      addToastMessage('取得評論失敗，請稍後再試', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const triggerAiReview = async () => {
    setLoading(true);
    try {
      const result = await fetchWithAuthCheck(`${API_BASE}/reviews/review-all`, {
        method: 'POST',
      });
      console.log('AI review result:', JSON.stringify(result, null, 2));
      if (!result || result.authError) {
        addToastMessage('請重新登入後台', 'danger');
        return;
      }
      if (result.message && result.message.includes('所有評論已審核')) {
        await fetchReviews(currentPage);
        result.data.forEach((review) => {
          addToastMessage(
            `評論 "${review.comment && review.comment.substring(0, 20)}..." ${review.status === 'APPROVED' ? '通過' : '拒絕'}: ${review.reason}`,
            review.status === 'APPROVED' ? 'success' : 'danger'
          );
        });
      } else {
        addToastMessage(`AI 審核失敗: ${result.message || '未知錯誤'}`, 'danger');
      }
    } catch (err) {
      console.error('AI review error:', err);
      addToastMessage('AI 審核失敗，請稍後再試', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
    setInputPage('');
  };

  const toggleVisibility = async (reviewId, currentVisible) => {
    const newVisible = !currentVisible;
    // 樂觀更新
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isVisible: newVisible } : r))
    );

    try {
      const result = await fetchWithAuthCheck(
        `${API_BASE}/admin/reviews/${reviewId}/visibility?visible=${newVisible}`,
        { method: 'PATCH' }
      );
      console.log('Toggle visibility result:', JSON.stringify(result, null, 2));
      if (!result || result.authError) {
        addToastMessage('請重新登入後台', 'danger');
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isVisible: currentVisible } : r))
        );
        return;
      }
      // 適應後端回應訊息
      if (!result.message || !result.message.includes('更新')) {
        addToastMessage(`切換可見狀態失敗: ${result.message || '未知錯誤'}`, 'danger');
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isVisible: currentVisible } : r))
        );
        return;
      }
      // 成功後重新獲取評論
      await fetchReviews(currentPage);
      addToastMessage('切換可見狀態成功', 'success');
    } catch (err) {
      console.error('Toggle visibility error:', err);
      addToastMessage('切換可見狀態失敗，請稍後再試', 'danger');
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isVisible: currentVisible } : r))
      );
    }
  };

  const toggleApproval = async (reviewId, currentApproved) => {
    const newApproved = !currentApproved;
    // 樂觀更新
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved: newApproved } : r))
    );

    try {
      const result = await fetchWithAuthCheck(
        `${API_BASE}/admin/reviews/${reviewId}/approve?approved=${newApproved}`,
        { method: 'PATCH' }
      );
      console.log('Toggle approval result:', JSON.stringify(result, null, 2));
      if (!result || result.authError) {
        addToastMessage('請重新登入後台', 'danger');
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isApproved: currentApproved } : r))
        );
        return;
      }
      // 適應後端回應訊息
      if (!result.message || !result.message.includes('更新')) {
        addToastMessage(`切換審核狀態失敗: ${result.message || '未知錯誤'}`, 'danger');
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isApproved: currentApproved } : r))
        );
        return;
      }
      // 成功後重新獲取評論
      await fetchReviews(currentPage);
      addToastMessage('切換審核狀態成功', 'success');
    } catch (err) {
      console.error('Toggle approval error:', err);
      addToastMessage('切換審核狀態失敗，請稍後再試', 'danger');
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isApproved: currentApproved } : r))
      );
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('確定要刪除這則評論？')) return;
    setLoading(true);

    try {
      const result = await fetchWithAuthCheck(`${API_BASE}/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      console.log('Delete result:', JSON.stringify(result, null, 2));
      if (!result || result.authError) {
        addToastMessage('請重新登入後台', 'danger');
        return;
      }
      if (result.message && result.message.includes('成功')) {
        await fetchReviews(currentPage);
        addToastMessage('刪除成功', 'success');
      } else {
        addToastMessage(`刪除失敗: ${result.message || '未知錯誤'}`, 'danger');
      }
    } catch (err) {
      console.error('Delete error:', err);
      addToastMessage('刪除失敗，請稍後再試', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">評論管理</h2>
      <Button variant="primary" onClick={triggerAiReview} disabled={loading} className="mb-3">
        執行 AI 審核
      </Button>
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr><th>商品ID</th><th>使用者ID</th><th>評分</th><th>評論</th><th>可見</th><th>審核</th><th>AI 審核</th><th>操作</th></tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan="8" className="text-center">無評論資料</td></tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.productId}</td>
                    <td>{r.userId}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment && r.comment.length > 50 ? r.comment.substring(0, 50) + '...' : r.comment || ''}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        checked={r.isVisible || false}
                        onChange={() => toggleVisibility(r.id, r.isVisible)}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        checked={r.isApproved || false}
                        onChange={() => toggleApproval(r.id, r.isApproved)}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        checked={r.approvedByAi || false}
                        disabled
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