import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext'; // 路徑調整
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';
const PAGE_SIZE = 5;

export default function SellerProductsPage() {
  const {
    userData,
    fetchWithAuthCheck,
    addToastMessage,
  } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 分頁
  const [currentPage, setCurrentPage] = useState(1);

  // 搜尋關鍵字
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchSellerProducts = async () => {
    if (!userData) {
      addToastMessage('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/seller/products`);
      console.log('fetchSellerProducts res:', res);
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        setLoading(false);
        return;
      }
      if (res?.data) {
        setProducts(res.data);
        setCurrentPage(1); // 取得資料後回到第一頁
      } else {
        addToastMessage('取得商品失敗');
      }
    } catch (error) {
      console.error('fetchSellerProducts error:', error);
      addToastMessage('取得商品時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchSellerProducts();
  }, [userData]);

  // 依搜尋關鍵字過濾商品 (可根據需求調整過濾條件)
  const filteredProducts = products.filter(p => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword === '') return true; // 無搜尋則全部顯示
    // 商品名稱或商品ID包含關鍵字就顯示
    return (
      p.name?.toLowerCase().includes(keyword) ||
      String(p.id).includes(keyword)
    );
  });

  const totalPage = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // 商品上下架切換
  const toggleProductStatus = async (productId, currentStatus) => {
    if (!userData) {
      addToastMessage('請先登入');
      return;
    }
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const endpoint =
      newStatus === 'ACTIVE'
        ? `${API_BASE}/seller/products/${productId}/active`
        : `${API_BASE}/seller/products/${productId}/unactive`;

    try {
      const res = await fetchWithAuthCheck(endpoint, { method: 'PUT' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        return;
      }
      if (res?.message?.includes('成功')) {
        addToastMessage(`商品已${newStatus === 'ACTIVE' ? '上架' : '下架'}`);
        fetchSellerProducts();
      } else {
        addToastMessage('商品狀態變更失敗');
      }
    } catch (error) {
      console.error('toggleProductStatus error:', error);
      addToastMessage('變更商品狀態時發生錯誤');
    }
  };

  // 刪除商品
  const deleteProduct = async (productId) => {
    if (!window.confirm('確定要刪除此商品？')) return;
    if (!userData) {
      addToastMessage('請先登入');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/seller/products/${productId}`, {
        method: 'DELETE',
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        return;
      }
      if (res?.message?.includes('成功')) {
        addToastMessage('商品已刪除');
        fetchSellerProducts();
      } else {
        addToastMessage('刪除商品失敗');
      }
    } catch (error) {
      console.error('deleteProduct error:', error);
      addToastMessage('刪除商品時發生錯誤');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 20 }}>載入中...</div>;

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        請先登入才能管理賣家商品。
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: 20, textAlign: 'center' }}>賣家商品管理</h2>

      {/* 新增商品按鈕 */}
      <div style={{ marginBottom: 20, textAlign: 'right' }}>
        <button
          onClick={() => navigate('/seller/products/new')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#2980b9')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#3498db')}
        >
          新增商品
        </button>
      </div>

      {/* 搜尋欄 */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <input
          type="text"
          placeholder="快速搜尋商品名稱或ID"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1); // 搜尋時回到第一頁
          }}
          style={{
            width: 300,
            padding: '8px 12px',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>尚無符合條件的商品</div>
      ) : (
        <>
          {pageProducts.map((p) => {
            // 取主圖：number === -1，無則空字串
            const mainImageObj = Array.isArray(p.productImageDto)
              ? p.productImageDto.find(img => img.number === -1)
              : null;
            const mainImageUrl = mainImageObj?.imageUrl
              ? `http://localhost:8080${mainImageObj.imageUrl}`
              : null;

            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {mainImageUrl ? (
                    <img
                      src={mainImageUrl}
                      alt={p.name}
                      style={{ height: 80, width: 'auto', objectFit: 'contain', borderRadius: 4 }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 80,
                        width: 80,
                        backgroundColor: '#eee',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#aaa',
                        fontSize: 12,
                        borderRadius: 4,
                      }}
                    >
                      無圖片
                    </div>
                  )}
                  <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>NT$ {p.price}</div>
                <div style={{ flex: 1, textAlign: 'center' }}>{p.stock}</div>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: p.status === 'ACTIVE' ? 'green' : 'gray',
                    fontWeight: 'bold',
                  }}
                >
                  {p.status === 'ACTIVE' ? '上架中' : '下架中'}
                </div>
                <div style={{ flex: 2, textAlign: 'right' }}>
                  <button
                    onClick={() => toggleProductStatus(p.id, p.status)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: p.status === 'ACTIVE' ? '#f39c12' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      marginRight: 8,
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = p.status === 'ACTIVE' ? '#e67e22' : '#229954';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = p.status === 'ACTIVE' ? '#f39c12' : '#27ae60';
                    }}
                  >
                    {p.status === 'ACTIVE' ? '下架' : '上架'}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c0392b';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#e74c3c';
                    }}
                  >
                    刪除
                  </button>
                  <button
                    onClick={() => navigate(`/seller/products/edit/${p.id}`)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2980b9',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      marginRight: 8,
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#1c5980')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#2980b9')}
                  >
                    編輯
                </button>
                </div>
              </div>
            );
          })}

          {/* 分頁控制 */}
          <div
            style={{
              marginTop: 20,
              textAlign: 'center',
              userSelect: 'none',
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              fontSize: 14,
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #ccc',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                backgroundColor: currentPage === 1 ? '#eee' : 'white',
              }}
            >
              上一頁
            </button>

            <span>
              第 {currentPage} 頁 / 共 {totalPage} 頁
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
              disabled={currentPage === totalPage}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #ccc',
                cursor: currentPage === totalPage ? 'not-allowed' : 'pointer',
                backgroundColor: currentPage === totalPage ? '#eee' : 'white',
              }}
            >
              下一頁
            </button>
          </div>
        </>
      )}
    </div>
  );
}
