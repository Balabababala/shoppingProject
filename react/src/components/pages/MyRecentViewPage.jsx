import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext.jsx';
import ModernProductCard from '../../components/ModernProductCard.jsx';

const BASE_API = 'http://localhost:8080/api';

function MyRecentlyViewedPage() {
  const { userData, addToastMessage, fetchWithAuthCheck } = useContext(AppContext);

  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.userId) {
      setRecentlyViewedProducts([]);
      return;
    }

    const fetchRecentlyViewed = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithAuthCheck(`${BASE_API}/recent/buyer/${userData.userId}`);

        if (data?.data) {
          const products = data.data.map((item) => ({
            id: item.productId,
            productName: item.productName,
            productImage: item.productImage ? `http://localhost:8080${item.productImage}` : null,
            viewedAt: item.viewedAt,
          }));
          setRecentlyViewedProducts(products);
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
