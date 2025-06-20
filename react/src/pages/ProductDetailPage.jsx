import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  ListGroup,
} from "react-bootstrap";
import Slider from "react-slick";
import { AppContext } from "../contexts/AppContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    userData,
    setCartItems,
    addToastMessage,
    API_BASE,
    BASE_URL,
    fetchWithAuthCheck,
    handleLogout,
  } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const sliderMain = useRef(null);
  const sliderThumbs = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  // 評論相關
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // 是否已評論過

  const placeholderLarge = "https://dummyimage.com/600x600/ccc/fff&text=No+Image";

  // 設定 slick slider 的控制
  useLayoutEffect(() => {
    setNav1(sliderMain.current);
    setNav2(sliderThumbs.current);
  }, []);

  // 載入商品資料
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchWithAuthCheck(`${API_BASE}/products/${id}`)
      .then((data) => {
        if (!data) throw new Error("找不到商品");
        setProduct(data.data);
        setQuantity(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, API_BASE, fetchWithAuthCheck]);

  // 載入評論列表
  useEffect(() => {
    if (!product) return;

    setReviewLoading(true);
    setReviewError(null);

    fetchWithAuthCheck(`${API_BASE}/reviews/product/${product.id}`)
      .then((data) => {
        setReviews(data?.data || []);
      })
      .catch((err) => setReviewError(err.message))
      .finally(() => setReviewLoading(false));
  }, [product, API_BASE, fetchWithAuthCheck]);

  // 檢查收藏狀態
  useEffect(() => {
    if (!userData || !product) return;

    fetchWithAuthCheck(
      `${API_BASE}/favorites/check?userId=${userData.user.userId || userData.user.id}&productId=${product.id}`
    )
      .then((data) => setIsFavorite(Boolean(data?.data)))
      .catch(() => setIsFavorite(false));
  }, [userData, product, API_BASE, fetchWithAuthCheck]);

  // 檢查是否已評論過
  useEffect(() => {
    if (!userData || !product) {
      setHasReviewed(false);
      return;
    }
    fetchWithAuthCheck(
  `${API_BASE}/reviews/check?userId=${userData.user.userId || userData.user.id}&productId=${product.id}`
)
  .then((res) => {
    console.log("check review data:", res);
    setHasReviewed(Boolean(res.data));
  })
  }, [userData, product, API_BASE, fetchWithAuthCheck]);

  // 加入購物車
  const handleAddToCart = async () => {
    if (!userData) {
      addToastMessage("請先登入才能加入購物車！");
      navigate("/userlogin");
      return;
    }

    let qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (product.stock && qty > product.stock) qty = product.stock;

    try {
      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          userId: userData.user.userId || userData.user.id,
          productId: product.id,
          quantity: qty,
        }),
      });

      if (res.status === 403) {
        handleLogout("權限不足，請重新登入");
        return;
      }

      if (!res.ok) throw new Error(`加入購物車失敗，狀態碼: ${res.status}`);

      addToastMessage(`已加入購物車：${product.name} x ${qty}`);

      // 重新抓購物車資料
      const cartRes = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      const cartData = await cartRes.json();

      if (!cartData || !cartData.data) throw new Error("購物車資料格式錯誤");
      setCartItems(cartData.data);
    } catch (err) {
      addToastMessage(err.message);
    }
  };

  // 收藏切換
  const handleToggleFavorite = async () => {
    if (!userData) {
      addToastMessage("請先登入才能收藏商品！");
      navigate("/userlogin");
      return;
    }

    const method = isFavorite ? "DELETE" : "POST";
    const url = isFavorite ? `${API_BASE}/favorites/${product.id}` : `${API_BASE}/favorites`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body:
          method === "POST"
            ? JSON.stringify({
                userId: userData.user.userId || userData.user.id,
                productId: product.id,
              })
            : undefined,
      });

      if (res.status === 403) {
        handleLogout("權限不足，請重新登入");
        return;
      }

      if (!res.ok) throw new Error("收藏操作失敗");

      setIsFavorite(!isFavorite);
      addToastMessage(isFavorite ? "已移除收藏" : "已加入收藏");
    } catch (err) {
      addToastMessage(err.message);
    }
  };

  // 送出評論
  const handleSubmitReview = async () => {
    if (!userData) {
      addToastMessage("請先登入才能評論");
      navigate("/userlogin");
      return;
    }
    if (newComment.trim() === "") {
      addToastMessage("請輸入評論內容");
      return;
    }

    setSubmittingReview(true);

    try {
      await fetchWithAuthCheck(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      addToastMessage(hasReviewed ? "評論更新成功" : "評論送出成功");
      setNewRating(5);
      setNewComment("");

      // 重新抓評論列表
      const reviewRes = await fetch(`${API_BASE}/reviews/product/${product.id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      const reviewData = await reviewRes.json();
      setReviews(reviewData.data || []);

      // 重新檢查是否已評論過
      const checkData = await fetchWithAuthCheck(
        `${API_BASE}/reviews/check?userId=${userData.user.userId || userData.user.id}&productId=${product.id}`
      );
      setHasReviewed(Boolean(checkData));
    } catch (err) {
      if (err.message.includes("403")) {
        handleLogout("權限不足，請重新登入");
      } else {
        addToastMessage(err.message);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={handleBack} className="mt-3">
          返回上一頁
        </Button>
      </Container>
    );
  }

  const isUnavailable = product.status !== "ACTIVE" || product.isDeleted === true;

  const images =
    product.productImageDtos && product.productImageDtos.length > 0
      ? product.productImageDtos.map((img) =>
          img.imageUrl.startsWith("http") ? img.imageUrl : BASE_URL + img.imageUrl
        )
      : [placeholderLarge];

  const mainSettings = {
    asNavFor: nav2,
    arrows: true,
    infinite: false,
    fade: false,
  };

  const thumbSettings = {
    asNavFor: nav1,
    slidesToShow: images.length >= 5 ? 5 : images.length,
    swipeToSlide: true,
    focusOnSelect: true,
    infinite: false,
    arrows: false,
    centerMode: false,
    centerPadding: "0px",
  };

  const handleThumbClick = (index) => {
    if (sliderMain.current) {
      sliderMain.current.slickGoTo(index);
    }
  };

  return (
    <Container className="mt-5">
      <Button variant="link" onClick={handleBack} className="mb-3">
        &larr; 返回上一頁
      </Button>

      <Row>
        <Col md={6} className="d-flex flex-column align-items-center">
          <div style={{ width: "100%", maxWidth: 600, marginBottom: 15 }}>
            <Slider {...mainSettings} ref={sliderMain}>
              {images.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img}
                    alt={`商品主圖 ${idx + 1}`}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x600.png?text=No+Image";
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div style={{ width: "100%", maxWidth: 600 }}>
            <Slider {...thumbSettings} ref={sliderThumbs}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{ padding: "0 5px" }}
                  onClick={() => handleThumbClick(idx)}
                >
                  <img
                    src={img}
                    alt={`商品縮圖 ${idx + 1}`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                      border: "2px solid transparent",
                    }}
                    className="slick-thumb-img"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80.png?text=No+Image";
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h2 className="fw-bold mb-3">{product.name}</h2>

              {product.sellerUserDto?.username && (
                <div className="mb-3">
                  <span className="text-muted">賣家：</span>
                  <Badge bg="secondary" className="ms-1">
                    {product.sellerUserDto.username}
                  </Badge>
                </div>
              )}

              <h4 className="text-danger fw-semibold mb-3">
                NT$ {product.price.toLocaleString()}
              </h4>

              <div className="mb-3">
                <span className="me-2">庫存：</span>
                <Badge bg={product.stock > 0 ? "success" : "danger"}>
                  {product.stock === undefined
                    ? "無庫存資訊"
                    : product.stock > 0
                    ? `有貨（${product.stock}）`
                    : "缺貨"}
                </Badge>
              </div>

              {isUnavailable && (
                <Alert variant="warning" className="mb-3">
                  {product.isDeleted
                    ? "此商品已被刪除。"
                    : "此商品已下架，暫時無法購買。"}
                </Alert>
              )}

              {!isUnavailable && (
                <>
                  <Form.Group className="mb-3" controlId="quantityInput">
                    <Form.Label>數量</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={product.stock || 9999}
                      value={quantity}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setQuantity(val === "" ? "" : Number(val));
                        }
                      }}
                      disabled={product.stock === 0}
                      style={{ maxWidth: "120px" }}
                    />
                  </Form.Group>

                  <div className="d-grid mb-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={
                        product.stock === 0 ||
                        quantity < 1 ||
                        quantity > product.stock
                      }
                    >
                      {product.stock === 0 ? "缺貨中" : "加入購物車"}
                    </Button>
                  </div>
                </>
              )}

              <Button
                variant={isFavorite ? "danger" : "outline-danger"}
                onClick={handleToggleFavorite}
                disabled={isUnavailable}
              >
                {isFavorite ? "♥ 已收藏" : "♡ 加入收藏"}
              </Button>

              <Card.Text
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: "1.8",
                  color: "#444",
                }}
                className="mt-4"
              >
                {product.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 新增評論區 */}
      <Row className="mt-5">
        <Col md={8} className="mx-auto">
          <h3>商品評論</h3>

          {reviewLoading && (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {reviewError && <Alert variant="danger">{reviewError}</Alert>}

          {!reviewLoading && reviews.length === 0 && (
            <p className="text-muted">尚無任何評論，快來搶先發表吧！</p>
          )}

          <ListGroup className="mb-4">
            {reviews.map((r) => (
              <ListGroup.Item key={r.id}>
                <strong>{r.userDto?.username || "匿名"}</strong>{" "}
                <span style={{ color: "#f39c12" }}>
                  {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                </span>
                <p>{r.comment}</p>
                <small className="text-muted">
                  {new Date(r.createdAt).toLocaleString()}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* 新增評論表單 */}
          <Card>
            <Card.Body>
              <h5>{hasReviewed ? "更新評論" : "我要評論"}</h5>

              <Form.Group className="mb-3" controlId="ratingSelect">
                <Form.Label>評分</Form.Label>
                <Form.Select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>
                      {val} 星
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="commentTextarea">
                <Form.Label>評論內容</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="請輸入您的評論..."
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview
                  ? "送出中..."
                  : hasReviewed
                  ? "更新評論"
                  : "送出評論"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .slick-thumb-img.slick-current {
          border-color: #007bff !important;
        }
      `}</style>
    </Container>
  );
}

export default ProductDetailPage;
