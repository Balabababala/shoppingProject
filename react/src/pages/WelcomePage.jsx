import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Container, Row, Col } from 'react-bootstrap';
import ModernProductCard from '../components/ModernProductCard';

function WelcomePage() {
  const { API_BASE, fetchWithAuthCheck, userData, addToastMessage } = useContext(AppContext);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 根據你的 AppContext 結構判斷身分
  const shouldShowRecommendations = !userData || userData.user?.role === 'ROLE_BUYER';
  const fetchRecommendations = useCallback(async () => {
  if (!shouldShowRecommendations) {
    setRecommendedProducts([]);
    return;
  }
  setLoading(true);
  setError('');
  try {
    // 不用再帶 userId 了，因為後端會從 JWT 拿
    const url = `${API_BASE}/recommend/products`;
    const res = await fetchWithAuthCheck(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('推薦產品 API 回傳:', res);
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      setRecommendedProducts(res.data.slice(0, 8));
    } else {
      setRecommendedProducts([]);
      setError('目前無推薦產品可顯示');
    }
  } catch (err) {
    setRecommendedProducts([]);
    setError('無法載入推薦產品，請稍後再試');
    addToastMessage && addToastMessage('載入推薦產品失敗');
  } finally {
    setLoading(false);
  }
}, [API_BASE, fetchWithAuthCheck, shouldShowRecommendations, addToastMessage]);


  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <Container className="my-4">
      <h1 className="mb-4">歡迎來到首頁</h1>

      {shouldShowRecommendations && (
        <>
          <h2 className="my-4">推薦產品</h2>
          {loading ? (
            <div className="text-center">載入中...</div>
          ) : error ? (
            <div className="text-center text-muted">{error}</div>
          ) : recommendedProducts.length === 0 ? (
            <div className="text-center text-muted">暫無推薦產品</div>
          ) : (
            <Row>
              {recommendedProducts.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <ModernProductCard product={product} mode="default" />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default WelcomePage;
