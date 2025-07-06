import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { AppContext } from '../contexts/AppContext.jsx';
import ModernProductCard from '../components/ModernProductCard.jsx';

function MyRecentlyViewedPage() {
  const { userData, addToastMessage, fetchWithAuthCheck ,API_BASE} = useContext(AppContext);

  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.user?.userId) {
      setRecentlyViewedProducts([]);
      return;
    }

    const fetchRecentlyViewed = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchWithAuthCheck(`${API_BASE}/recent`);

    if (data?.data) {
      setRecentlyViewedProducts(data?.data);
    } else {
      setRecentlyViewedProducts([]);
    }
  } catch (err) {
    setError(err.message || '載入錯誤');
    addToastMessage('取得最近看過商品失敗');
  } finally {
    setLoading(false);
  }
};

    fetchRecentlyViewed();
  }, [userData, fetchWithAuthCheck, addToastMessage]);

  return (
    <Container className="py-5">
      <h2 className="mb-4">最近看過的商品</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">載入中...</p>
        </div>
      )}

      {error && <Alert variant="danger">錯誤：{error}</Alert>}

      {!loading && !error && recentlyViewedProducts.length === 0 && (
        <Alert variant="info">目前沒有最近看過的商品。</Alert>
      )}

      {!loading && !error && recentlyViewedProducts.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {recentlyViewedProducts.map((product) => (
            <Col key={product.id}>
              <ModernProductCard product={product} mode="viewed" />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyRecentlyViewedPage;
