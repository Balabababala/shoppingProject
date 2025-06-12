import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';

function SellerProductsPage() {
  const API_BASE = 'http://localhost:8080/api';
  const { userData, addToastMessage } = useContext(AppContext);

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
      setProducts(data.data);
    } catch (error) {
      addToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userData]);

    // 打開編輯 Modal，初始化多圖預覽陣列
    const handleEditClick = (product) => {
    setEditProduct({
      ...product,
      thumbnailFile: null,
      thumbnailPreview: product.thumbnailUrl || '',
      imageFiles: [],
      imagePreviews: product.extraImagesUrl || [],
    });
    setShowEditModal(true);
  };

  // 關閉 Modal，釋放所有 blob URL 避免記憶體洩漏
  const handleCloseModal = () => {
    if (editProduct?.imagePreviews) {
      editProduct.imagePreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    }
    setShowEditModal(false);
    setEditProduct(null);
  };

  // 儲存編輯（含多圖上傳）
  const handleSaveEdit = async () => {
    try {
      const { id, name, price, stock, imageFiles } = editProduct;

      // 更新商品基本資料
      const res = await fetch(`${API_BASE}/seller/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, stock }),
      });
      if (!res.ok) throw new Error('更新商品失敗');

      // 多圖上傳（若有選擇圖片）
      if (imageFiles.length > 0) {
        if (imageFiles.length > 10) {
          addToastMessage('最多只能上傳10張圖片');
          return;
        }

        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        const imageRes = await fetch(`${API_BASE}/seller/products/${id}/images`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!imageRes.ok) throw new Error('圖片上傳失敗');
      }

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

  // 多圖檔案選擇處理
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // 最多10張
    // 先釋放舊 blob URL
    if (editProduct.imagePreviews) {
      editProduct.imagePreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setEditProduct({
      ...editProduct,
      imageFiles: files,
      imagePreviews: newPreviews,
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>我的商品</h2>
      <Button as={Link} to="/seller/products/new" className="mb-3">
        新增商品
      </Button>

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
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  尚無商品
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {/* 顯示第一張圖片縮圖 */}
                    {p.thumbnailUrl ? (
                      <img src={`http://localhost:8080${p.thumbnailUrl}`} alt={p.name} width={80} />
                    ) : (
                      '無圖片'
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEditClick(p)}>
                      編輯
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                      刪除
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* 編輯商品 Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
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
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>庫存</Form.Label>
                <Form.Control
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, stock: parseInt(e.target.value, 10) || 0 })
                  }
                />
              </Form.Group>

              {/* 多圖預覽 */}
              <Form.Group className="mb-3">
                <Form.Label>主圖（縮圖）</Form.Label>
                {editProduct.thumbnailPreview && (
                  <div>
                    <img
                      src={editProduct.thumbnailPreview}
                      alt="主圖預覽"
                      width={100}
                      style={{ objectFit: 'cover', border: '1px solid #ccc', marginBottom: '10px' }}
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (editProduct.thumbnailPreview?.startsWith('blob:')) {
                        URL.revokeObjectURL(editProduct.thumbnailPreview);
                      }
                      setEditProduct({
                        ...editProduct,
                        thumbnailFile: file,
                        thumbnailPreview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>其他圖片（最多9張）</Form.Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {editProduct.imagePreviews.length === 0 && <span>無圖片</span>}
                {editProduct.imagePreviews.map((url, idx) => (
                  <img
                    key={`preview-${idx}`} // 更穩定的 key
                    src={url}
                    alt={`圖片預覽${idx}`}
                    width={100}
                    style={{ objectFit: 'cover', border: '1px solid #ccc' }}
                  />
                ))}

              </div>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files).slice(0, 9);
                  editProduct.imagePreviews.forEach((url) => {
                    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
                  });
                  const newPreviews = files.map((f) => URL.createObjectURL(f));
                  setEditProduct({
                    ...editProduct,
                    imageFiles: files,
                    imagePreviews: newPreviews,
                  });
                }}
              />
            </Form.Group>

            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            儲存
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SellerProductsPage;
