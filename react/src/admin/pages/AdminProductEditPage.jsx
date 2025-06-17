import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
} from 'react-bootstrap';

export default function AdminProductEditPage() {
  const { id } = useParams();
  const { fetchWithAuthCheck, addToastMessage, adminUserData, API_BASE } = useContext(AdminAppContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'ACTIVE',
    categoryId: '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [oldMainImageUrl, setOldMainImageUrl] = useState('');
  const [extraImages, setExtraImages] = useState([]);
  const [oldExtraImages, setOldExtraImages] = useState([]);
  const [removeExtraImageIds, setRemoveExtraImageIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 取分類葉 給下拉用
  useEffect(() => {
    fetch(`${API_BASE}/categories/leaf`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setCategories(data.data);
      })
      .catch(() => addToastMessage('分類資料載入失敗'));
  }, [API_BASE, addToastMessage]);

  // 取商品資料
  useEffect(() => {
    if (!adminUserData) {
      addToastMessage('請先登入');
      navigate('/admin/');
      return;
    }
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuthCheck(`${API_BASE}/admin/products/${id}`);
        // console.log('fetch product res:', res);
        if (res?.authError) {
          addToastMessage('身份驗證失效，請重新登入');
          navigate('/login');
          return;
        }

        const p = res?.data;
        if (!p) {
          addToastMessage('找不到該商品');
          navigate('/admin/products');
          return;
        }

        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          stock: p.stock || '',
          status: p.status || 'ACTIVE',
          categoryId: p.categoryId || '',
        });

        setOldMainImageUrl(p.thumbnailUrl || '');
        setOldExtraImages(p.extraImages || []);
      } catch (err) {
        console.error('fetch product error:', err);
        addToastMessage('取得商品資料失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, adminUserData, API_BASE, addToastMessage, fetchWithAuthCheck, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const currentCount =
      oldExtraImages.filter((img) => !removeExtraImageIds.includes(img.id)).length + extraImages.length;

    if (currentCount + files.length > 9) {
      addToastMessage('其他圖片最多只能有 9 張（含舊有圖片）');
      return;
    }

    setExtraImages((prev) => [...prev, ...files]);
  };

  const handleRemoveOldExtraImage = (id) => {
    setRemoveExtraImageIds((prev) => [...prev, id]);
  };

  const handleRemoveNewExtraImage = (index) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('sellerId', 123);
      data.append('description', formData.description.trim());
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('status', formData.status);
      data.append('categoryId', formData.categoryId);

      if (mainImage) data.append('thumbnail', mainImage);
      extraImages.forEach((file) => data.append('extraImages', file));
      if (removeExtraImageIds.length > 0)
        data.append('removeExtraImageIds', JSON.stringify(removeExtraImageIds));

      const res = await fetchWithAuthCheck(`${API_BASE}/admin/products/${id}`, {
        method: 'PUT',
        body: data,
      });

      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        navigate('/login');
        return;
      }

      if (res?.message?.includes('成功')) {
        addToastMessage('商品修改成功');
        navigate('/admin/products');
      } else {
        console.error(res?.message);
        addToastMessage('修改商品失敗');
      }
    } catch (error) {
      console.error('update product error:', error);
      addToastMessage('修改商品時發生錯誤');
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        載入中...
      </div>
    );

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">編輯商品 (管理員)</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Card className="p-4 shadow-sm">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="productName">
                <Form.Label>商品名稱 *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="categoryId">
                <Form.Label>分類 ID *</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">請選擇分類</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>商品描述</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="price">
                <Form.Label>價格 (NT$) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
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
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="status">
            <Form.Label>商品狀態 *</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="ACTIVE">上架中</option>
              <option value="INACTIVE">下架中</option>
            </Form.Select>
          </Form.Group>

          {/* 主圖 */}
          <Form.Group className="mb-4">
            <Form.Label>主圖片（僅限 1 張）</Form.Label>
            {(mainImagePreview || oldMainImageUrl) && (
              <div className="mb-2">
                <Image
                  src={mainImagePreview || oldMainImageUrl}
                  thumbnail
                  style={{ maxHeight: 200 }}
                />
              </div>
            )}
            <Form.Control type="file" accept="image/*" onChange={handleMainImageChange} />
            <Form.Text className="text-muted">
              {mainImage ? `已選擇：${mainImage.name}` : '尚未選擇新圖片'}
            </Form.Text>
          </Form.Group>

          {/* 其他圖片 */}
          <Form.Group className="mb-4">
            <Form.Label>其他圖片（最多 9 張）</Form.Label>
            <Row className="mb-2 g-2">
              {oldExtraImages
                .filter((img) => !removeExtraImageIds.includes(img.id))
                .map((img) => (
                  <Col xs={4} md={3} key={img.id} className="position-relative">
                    <Image
                      src={img.url}
                      thumbnail
                      style={{ height: 100, objectFit: 'cover' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => handleRemoveOldExtraImage(img.id)}
                    >
                      ×
                    </Button>
                  </Col>
                ))}
              {extraImages.map((file, i) => (
                <Col xs={4} md={3} key={i} className="position-relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    thumbnail
                    style={{ height: 100, objectFit: 'cover' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0"
                    onClick={() => handleRemoveNewExtraImage(i)}
                  >
                    ×
                  </Button>
                </Col>
              ))}
            </Row>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleExtraImagesChange}
            />
            <Form.Text className="text-muted">其他圖片最多 9 張（含舊有圖片）</Form.Text>
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? '送出中...' : '儲存商品'}
            </Button>
          </div>
        </Card>
      </Form>
    </Container>
  );
}
