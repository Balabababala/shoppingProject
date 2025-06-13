import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';

export default function SellerProductEditPage() {
  const { id } = useParams();
  const { fetchWithAuthCheck, addToastMessage, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'ACTIVE',
    categoryId: '',
  });

  const [mainImage, setMainImage] = useState(null); // 新上傳主圖 (File)
  const [oldMainImageUrl, setOldMainImageUrl] = useState(''); // 舊主圖網址（可顯示預覽）

  const [extraImages, setExtraImages] = useState([]); // 新上傳其他圖 (File[])
  const [oldExtraImages, setOldExtraImages] = useState([]); // 舊其他圖清單 [{id, url}]

  // const [removeExtraImageIds, setRemoveExtraImageIds] = useState([]); // 要刪除的其他圖 id 清單

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 載入商品資料
  useEffect(() => {
    if (!userData) {
      addToastMessage('請先登入');
      navigate('/login');
      return;
    }
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuthCheck(`${API_BASE}/seller/products/${id}`);
        if (res?.authError) {
          addToastMessage('身份驗證失效，請重新登入');
          navigate('/login');
          return;
        }
        if (res?.data) {
          const p = res.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            stock: p.stock || '',
            status: p.status || 'ACTIVE',
            categoryId: p.categoryId || '',
          });

          setOldMainImageUrl(p.thumbnailUrl || ''); // 主圖網址
          setOldExtraImages(p.extraImages || []); // 其他圖陣列 [{id, url}]
        } else {
          addToastMessage('找不到該商品');
          navigate('/seller/products');
        }
      } catch (error) {
        console.error('fetch product error:', error);
        addToastMessage('取得商品資料失敗');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, userData, addToastMessage, fetchWithAuthCheck, navigate]);

  // 表單欄位變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 主圖替換
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setOldMainImageUrl(URL.createObjectURL(file)); // 預覽新主圖
    }
  };

  // 新增其他圖（多張）
  const handleExtraImagesChange = (e) => {
  const files = Array.from(e.target.files);
  // 新上傳 + 舊有(不含刪除) + 現有新增合計不可超過9
  // removeExtraImageIds 不再計算
  const currentCount = oldExtraImages.length + extraImages.length;
  if (files.length + currentCount > 9) {
    addToastMessage('其他圖片最多只能有 9 張（含舊有圖片）');
    return;
  }
  setExtraImages((prev) => [...prev, ...files]);
};



  // 刪除「舊有圖片顯示（可移除）」中按鈕的部分，只顯示圖片
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    {oldExtraImages.map((img) => (
      <div key={img.id}>
        <img
          src={img.url}
          alt="其他圖片"
          style={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            borderRadius: 6,
          }}
        />
      </div>
    ))}
  </div>

  // 表單送出
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 簡單驗證必填
    // if (!formData.name.trim() || !formData.price || !formData.stock || !formData.categoryId) {
    //   addToastMessage('請填寫必填欄位');
    //   return;
    // }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('status', formData.status);
      data.append('categoryId', formData.categoryId);

      if (mainImage) {
        data.append('thumbnail', mainImage);
      }

      extraImages.forEach((file) => {
        data.append('extraImages', file);
      });

      // if (removeExtraImageIds.length > 0) {
      //   data.append('removeExtraImageIds', JSON.stringify(removeExtraImageIds));
      // }

      const res = await fetchWithAuthCheck(`${API_BASE}/seller/products/${id}`, {
        method: 'PUT',
        body: data,
      });
      for (const pair of data.entries()) console.log(pair[0], pair[1]);
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        navigate('/login');
        return;
      }
      if (res?.message?.includes('成功')) {
        addToastMessage('商品修改成功');
        navigate('/seller/products');
      } else {
        addToastMessage('修改商品失敗');
      }
    } catch (error) {
      console.error('update product error:', error);
      addToastMessage('修改商品時發生錯誤');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>載入中...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: 20, textAlign: 'center' }}>編輯商品</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* 商品名稱 */}
        <div style={{ marginBottom: 12 }}>
          <label>商品名稱 *</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            // required
          />
        </div>

        {/* 商品描述 */}
        <div style={{ marginBottom: 12 }}>
          <label>商品描述</label><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        {/* 價格 */}
        <div style={{ marginBottom: 12 }}>
          <label>價格 (NT$) *</label><br />
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* 庫存 */}
        <div style={{ marginBottom: 12 }}>
          <label>庫存數量 *</label><br />
          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* 狀態 */}
        <div style={{ marginBottom: 12 }}>
          <label>商品狀態 *</label><br />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            required
          >
            <option value="ACTIVE">上架中</option>
            <option value="INACTIVE">下架中</option>
          </select>
        </div>

        {/* 分類ID */}
        <div style={{ marginBottom: 20 }}>
          <label>分類ID *</label><br />
          <input
            type="number"
            name="categoryId"
            min="1"
            value={formData.categoryId}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* 主圖 */}
        <div style={{ marginBottom: 20 }}>
          <label>主圖片（僅限 1 張）</label><br />
          {oldMainImageUrl && (
            <div style={{ marginBottom: 8 }}>
              <img src={oldMainImageUrl} alt="主圖片" style={{ maxWidth: '100%', maxHeight: 200 }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleMainImageChange} />
          <small>{mainImage ? `已選擇：${mainImage.name}` : '尚未選擇新圖片'}</small>
        </div>

        {/* 其他圖片 */}
        <div style={{ marginBottom: 20 }}>
          <label>其他圖片（最多 9 張）</label><br />

          {/* 舊有圖片顯示（可移除） */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {oldExtraImages.map((img) => {
              const isRemoved = removeExtraImageIds.includes(img.id);
              return (
                <div key={img.id} style={{ position: 'relative' }}>
                  <img
                    src={img.url}
                    alt="其他圖片"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      filter: isRemoved ? 'grayscale(100%)' : 'none',
                      opacity: isRemoved ? 0.5 : 1,
                      borderRadius: 6,
                    }}
                  />
                  {isRemoved ? (
                    <button
                      type="button"
                      onClick={() => handleUndoRemoveOldExtraImage(img.id)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                      }}
                      title="取消刪除"
                    >
                      ↺
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveOldExtraImage(img.id)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                      }}
                      title="刪除圖片"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 新上傳圖片預覽與移除 */}
          {extraImages.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {extraImages.map((file, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="新上傳圖片"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewExtraImage(i)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                    }}
                    title="移除新圖片"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleExtraImagesChange}
            style={{ marginTop: 10 }}
          />
          <small>其他圖片最多 9 張（含舊有圖片）</small>
        </div>

        {/* 送出按鈕 */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={uploading}
            style={{
              padding: '10px 30px',
              fontSize: 16,
              borderRadius: 6,
              border: 'none',
              backgroundColor: uploading ? '#ccc' : '#007bff',
              color: 'white',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? '送出中...' : '儲存商品'}
          </button>
        </div>
      </form>
    </div>
  );
}
