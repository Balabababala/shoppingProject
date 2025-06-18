import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Container, Row, Col } from 'react-bootstrap';
import ModernProductCard from '../components/ModernProductCard';

function WelcomePage() {
  const { API_BASE, fetchWithAuthCheck, userData, addToastMessage } = useContext(AppContext);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 判斷是否應顯示推薦產品（未登入或買家）
  const shouldShowRecommendations = !userData || userData.roleId === 1;

  const fetchRecommendations = useCallback(async () => {
    if (!shouldShowRecommendations) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/recommend/products${userData?.id ? `?userId=${userData.id}` : ''}`;
      const data = await fetchWithAuthCheck(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (data?.data?.length > 0) {
        setRecommendedProducts(data.data.slice(0, 8));
        console.log('recommendedProducts:', recommendedProducts);
      } else {
        setRecommendedProducts([]);
        setError('目前無推薦產品可顯示');
      }
    } catch (error) {
      setRecommendedProducts([]);
      setError('無法載入推薦產品，請稍後再試');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, fetchWithAuthCheck, userData?.id, shouldShowRecommendations]);

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
          ) : recommendedProducts.length === 0 ? (
            <div className="text-center text-muted">{error || '暫無推薦產品'}</div>
          ) : (
            <Row>
              {recommendedProducts.map(product => (
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
