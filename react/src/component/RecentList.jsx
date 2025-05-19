import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

function RecentList({ products }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Row>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card
                onClick={() => goToDetail(product.id)}
                style={{ cursor: 'pointer' }}
                className="h-100 shadow-sm"
              >
                <Card.Img
                  variant="top"
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted">價格：${product.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>目前沒有產品。</p>
        )}
      </Row>

      {/* 分頁按鈕 */}
      {totalPages > 1 && (
        <ButtonGroup className="mt-3" aria-label="Page navigation example">
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx + 1}
              variant={currentPage === idx + 1 ? 'primary' : 'outline-primary'}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </>
  );
}

export default RecentList;
