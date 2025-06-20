import React, { useContext, useState } from "react";
import { Container, Row, Col, Button, Image, Card, Pagination } from "react-bootstrap";
import { AppContext } from '../contexts/AppContext';
import { Link } from "react-router-dom";  
import "../css/CartPage.css";

function MyCartPage() {
  const { BASE_URL, API_BASE, cartItems, setCartItems, clearCart, addToastMessage, userData } = useContext(AppContext);
  const [loadingClear, setLoadingClear] = useState(false);

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const removeItem = async (productId) => {
    if (!userData?.token) {
      addToastMessage("請先登入");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (!response.ok) throw new Error('刪除失敗');

      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      addToastMessage('商品已從購物車移除');
    } catch (error) {
      console.error('刪除商品錯誤:', error);
      addToastMessage('刪除商品失敗，請稍後再試');
    }
  };

  const handleClearCart = async () => {
    setLoadingClear(true);
    try {
      await clearCart();
    } catch (error) {
      addToastMessage('清空購物車失敗，請稍後再試');
      console.error(error);
    } finally {
      setLoadingClear(false);
    }
  };

  // 分頁邏輯
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const paginatedItems = cartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4">購物車</h2>

      {cartItems.length === 0 ? (
        <p>您的購物車是空的。</p>
      ) : (
        <>
          <Row className="g-3">
            {paginatedItems.map((item) => (
              <Col key={item.productId} xs={12}>
                <Card className="position-relative">
                  <Row className="g-0 align-items-center">
                    <Col xs={3} md={2}>
                      <Link to={`/products/${item.productId}`}>
                        {item.imageUrl ? (
                          <Image
                            src={`${BASE_URL}${item.imageUrl}`}
                            alt={item.productName}
                            fluid
                            rounded
                            style={{ height: "100px", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="bg-secondary text-white d-flex align-items-center justify-content-center"
                            style={{ height: "100px" }}
                          >
                            無圖片
                          </div>
                        )}
                      </Link>
                    </Col>
                    <Col xs={9} md={8}>
                      <Card.Body>
                        <Card.Title>
                          <Link
                            to={`/products/${item.productId}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {item.productName}
                          </Link>
                        </Card.Title>
                        <Card.Text>單價: ${item.price.toLocaleString()}</Card.Text>
                        <Card.Text>數量: {item.quantity}</Card.Text>
                        <Card.Text>
                          小計: ${(item.price * item.quantity).toLocaleString()}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                    <Col xs={12} md={2} className="text-end pe-3">
                      <Button
                        variant="danger"
                        onClick={() => removeItem(item.productId)}
                      >
                        刪除
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 分頁控制元件 */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <Pagination>
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Col>
            </Row>
          )}

          <Row className="mt-4">
            <Col xs={12} md={{ span: 4, offset: 8 }}>
              <Card className="p-3">
                <h4>結帳</h4>
                <div className="d-flex justify-content-between mb-3">
                  <span>總計</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <Button
                  as={Link}
                  to="/checkout"
                  variant="primary"
                  className="w-100"
                  disabled={cartItems.length === 0}
                >
                  結帳
                </Button>
                <Button
                  variant="warning"
                  onClick={handleClearCart}
                  className="mt-2"
                  disabled={loadingClear || cartItems.length === 0}
                >
                  {loadingClear ? '清空中...' : '清空購物車'}
                </Button>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default MyCartPage;
