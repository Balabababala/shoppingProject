import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Image,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminAppContext } from '../contexts/AdminAppContext';
import Select from 'react-select';

function AdminProductNewPage() {
  const { addToastMessage, API_BASE } = useContext(AdminAppContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    status: 'ACTIVE',
    sellerId: '',
  });

  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [extraImages, setExtraImages] = useState([]);
  const [extraImagesPreviews, setExtraImagesPreviews] = useState([]);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/categories/leaf`, { credentials: 'include' }).then((res) => res.json()),
      fetch(`${API_BASE}/admin/sellers`, { credentials: 'include' }).then((res) => res.json()),
    ])
      .then(([categoriesData, sellersData]) => {
        setCategories(categoriesData.data || []);
        setSellers(sellersData.data || []);
      })
      .catch(() => addToastMessage('分類或賣家資料載入失敗'));
  }, [API_BASE, addToastMessage]);

  useEffect(() => {
    if (!mainImage) {
      setMainImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(mainImage);
    setMainImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [mainImage]);

  useEffect(() => {
    extraImagesPreviews.forEach((url) => URL.revokeObjectURL(url));
    if (extraImages.length === 0) {
      setExtraImagesPreviews([]);
      return;
    }
    const urls = extraImages.map((file) => URL.createObjectURL(file));
    setExtraImagesPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [extraImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 9) {
      addToastMessage('其他圖片最多只能選擇 9 張');
      setExtraImages(files.slice(0, 9));
    } else {
      setExtraImages(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', parseFloat(product.price));
      formData.append('stock', parseInt(product.stock, 10));
      formData.append('categoryId', product.categoryId);
      formData.append('status', product.status);
      formData.append('sellerId', product.sellerId);

      if (mainImage) formData.append('thumbnail', mainImage);
      extraImages.forEach((file) => {
        formData.append('extraImages', file);
      });

      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '新增商品失敗');
      }

      addToastMessage('新增商品成功');
      navigate('/admin/products');
    } catch (error) {
      addToastMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">新增商品</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Card className="p-4 shadow-sm">
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>商品名稱 *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="price">
                <Form.Label>價格 (NT$) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="stock">
                <Form.Label>庫存數量 *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="categoryId">
            <Form.Label>分類 *</Form.Label>
            <Select
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              value={
                categories.find((c) => c.id === product.categoryId)
                  ? {
                      value: product.categoryId,
                      label: categories.find((c) => c.id === product.categoryId).name,
                    }
                  : null
              }
              onChange={(selected) =>
                setProduct((prev) => ({
                  ...prev,
                  categoryId: selected ? selected.value : '',
                }))
              }
              placeholder="請選擇分類"
              isClearable
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="sellerId">
            <Form.Label>賣家 *</Form.Label>
            <Select
              options={sellers.map((s) => ({
                value: s.id,
                label: `${s.name}（${s.email}）`,
              }))}
              value={
                sellers.find((s) => s.id === product.sellerId)
                  ? {
                      value: product.sellerId,
                      label: `${sellers.find((s) => s.id === product.sellerId).name}（${sellers.find((s) => s.id === product.sellerId).email}）`,
                    }
                  : null
              }
              onChange={(selected) =>
                setProduct((prev) => ({
                  ...prev,
                  sellerId: selected ? selected.value : '',
                }))
              }
              placeholder="請選擇賣家"
              isClearable
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="thumbnail">
            <Form.Label>主圖片（僅限 1 張）</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
            />
            <Form.Text className="text-muted">
              {mainImage ? `已選擇：${mainImage.name}` : '尚未選擇圖片'}
            </Form.Text>
            {mainImagePreview && (
              <div className="mt-2">
                <Image src={mainImagePreview} thumbnail style={{ maxHeight: 200 }} />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4" controlId="extraImages">
            <Form.Label>其他圖片（最多 9 張）</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleExtraImagesChange}
            />
            <Form.Text className="text-muted">
              已選擇 {extraImages.length} 張
            </Form.Text>
            <Row className="mt-2 g-2">
              {extraImagesPreviews.map((src, i) => (
                <Col xs={4} md={3} key={i}>
                  <Image src={src} thumbnail style={{ height: 100, objectFit: 'cover' }} />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? (
                <>
                  <Spinner animation="border" size="sm" /> 上傳中...
                </>
              ) : (
                '新增商品'
              )}
            </Button>
          </div>
        </Card>
      </Form>
    </Container>
  );
}

export default AdminProductNewPage;
