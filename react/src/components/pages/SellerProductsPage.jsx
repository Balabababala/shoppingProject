import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';

function SellerProductsPage() {
  const API_BASE = 'http://localhost:8080/api';
  const { addToastMessage } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // 取得賣家商品清單
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller/products`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('取得商品失敗');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      addToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 打開編輯 Modal
  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // 關閉 Modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  // 儲存編輯（可擴充）
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/seller/products/${editProduct.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct),
      });
      if (!res.ok) throw new Error('更新商品失敗');
      addToastMessage('更新成功');
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      addToastMessage(error.message);
    }
  };

  // 刪除商品
  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這個商品嗎？')) return;
    try {
      const res = await fetch(`${API_BASE}/seller/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('刪除商品失敗');
      addToastMessage('刪除成功');
      fetchProducts();
    } catch (error) {
      addToastMessage(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>我的商品</h2>
      <Button as={Link} to="/seller/products/new" className="mb-3">新增商品</Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>庫存</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">尚無商品</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id}>
                <td><img src={p.imageUrl} alt={p.name} width={80} /></td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEditClick(p)}>編輯</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>刪除</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 編輯商品 Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>編輯商品</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProduct && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>商品名稱</Form.Label>
                <Form.Control
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>價格</Form.Label>
                <Form.Control
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>庫存</Form.Label>
                <Form.Control
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value, 10) })}
                />
              </Form.Group>
              {/* 可擴充其他欄位 */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>取消</Button>
          <Button variant="primary" onClick={handleSaveEdit}>儲存</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SellerProductsPage;
