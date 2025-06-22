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
import Select from 'react-select';
import { AppContext } from '../contexts/AppContext';

function SellerProductNewPage() {
  const { addToastMessage, API_BASE ,fetchWithAuthCheck} = useContext(AppContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    status: 'ACTIVE',
  });

  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 取得葉分類資料，避免無限請求
  useEffect(() => {
    fetch(`${API_BASE}/categories/leaf`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          setCategories(json.data);
        } else {
          addToastMessage('分類資料載入失敗: ' + (json.message || ''));
        }
      })
      .catch(() => addToastMessage('分類資料載入失敗'));
  }, [API_BASE, addToastMessage]);

  // input 值改變事件
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // react-select 選擇分類事件
  const handleCategoryChange = (selectedOption) => {
    setProduct((prev) => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : '',
    }));
  };

  // 主圖片選擇
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
  };

  // 其他圖片選擇，限制最多9張
  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 9) {
      addToastMessage('其他圖片最多只能選擇 9 張');
      setExtraImages(files.slice(0, 9));
    } else {
      setExtraImages(files);
    }
  };

  // 表單送出
  const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);
  try {
    const formData = new FormData();
    Object.entries(product).forEach(([key, val]) => formData.append(key, val));
    if (mainImage) formData.append('thumbnail', mainImage);
    extraImages.forEach((file) => formData.append('extraImages', file));

    // 這裡用 fetchWithAuthCheck，fetchWithAuthCheck 預設 header 有帶 token
    const res = await fetchWithAuthCheck(`${API_BASE}/seller/products`, {
      method: 'POST',
      body: formData,
      // 注意：不能再加 'Content-Type': multipart/form-data，瀏覽器會自動設定 boundary
    });

    if (!res || res.authError) {
      throw new Error('請先登入');
    }
    if (res.status && res.status !== 'success') {
      throw new Error(res.message || '新增商品失敗');
    }

    addToastMessage('新增商品及圖片成功');
    navigate('/seller/products');
  } catch (error) {
    addToastMessage(error.message);
  } finally {
    setUploading(false);
  }
};

  // 轉換分類為 react-select 格式
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // 目前選擇的分類
  const selectedCategory =
    categoryOptions.find((opt) => opt.value === product.categoryId) || null;

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
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              isClearable
              placeholder="請選擇分類"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Label>商品狀態 *</Form.Label>
            <Form.Select
              name="status"
              value={product.status}
              onChange={handleChange}
              required
            >
              <option value="ACTIVE">上架</option>
              <option value="INACTIVE">下架</option>
            </Form.Select>
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
            {mainImage && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(mainImage)}
                  thumbnail
                  style={{ maxHeight: 200 }}
                  alt="主圖片預覽"
                />
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
              {extraImages.map((img, i) => (
                <Col xs={4} md={3} key={i}>
                  <Image
                    src={URL.createObjectURL(img)}
                    thumbnail
                    style={{ height: 100, objectFit: 'cover' }}
                    alt={`其他圖片預覽 ${i + 1}`}
                  />
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

export default SellerProductNewPage;
