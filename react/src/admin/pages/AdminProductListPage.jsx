import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

function AdminProductListPage() {
  const { API_BASE, BASE_URL, adminUserData, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // 取得商品列表
  const fetchProducts = async () => {
    if (!adminUserData) {
      setError('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/products`);
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        setError('身份驗證失效');
      } else if (res?.data) {
        setProducts(res.data);
        setCurrentPage(1);
      } else {
        addToastMessage('取得商品失敗');
        setError('取得商品失敗');
      }
    } catch (e) {
      setError('取得商品時發生錯誤');
      addToastMessage('取得商品時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [adminUserData]);

  // 排序處理
  const sortedProducts = [...products];
  if (sortBy) {
    sortedProducts.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'status') {
        valA = valA === 'ACTIVE' ? 1 : 0;
        valB = valB === 'ACTIVE' ? 1 : 0;
      }
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortAsc ? valA - valB : valB - valA;
      }
    });
  }

  // 搜尋過濾
  const filteredProducts = sortedProducts.filter(p => {
    const kw = searchKeyword.trim().toLowerCase();
    return (
      kw === '' ||
      p.name?.toLowerCase().includes(kw) ||
      String(p.id).includes(kw)
    );
  });

  const totalPage = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // 切換商品狀態（上架/下架）
  const toggleStatus = async (id, status) => {
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const url = `${API_BASE}/admin/products/${id}/${newStatus === 'ACTIVE' ? 'active' : 'unactive'}`;
    try {
      const res = await fetchWithAuthCheck(url, { method: 'PUT' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage(`商品已${newStatus === 'ACTIVE' ? '上架' : '下架'}`);
        fetchProducts();
      } else {
        addToastMessage('商品狀態變更失敗');
      }
    } catch {
      addToastMessage('變更商品狀態時發生錯誤');
    }
  };

  // 刪除商品
  const deleteProduct = async (id) => {
    if (!window.confirm('確定要刪除此商品？')) return;
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('商品已刪除');
        fetchProducts();
      } else {
        addToastMessage('刪除商品失敗');
      }
    } catch {
      addToastMessage('刪除商品時發生錯誤');
    }
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!adminUserData) return <div>請先登入才能管理商品</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>管理員商品列表</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => navigate('/admin/products/new')}>新增商品</button>
        <input
          type="text"
          placeholder="搜尋商品名稱或ID"
          value={searchKeyword}
          onChange={e => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ marginLeft: 12, padding: 4 }}
        />
      </div>

      <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: 6 }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSort('id')}>
          商品ID {sortBy === 'id' ? (sortAsc ? '↑' : '↓') : ''}
        </div>
        <div style={{ flex: 2, cursor: 'pointer' }} onClick={() => handleSort('name')}>
          商品名稱 {sortBy === 'name' ? (sortAsc ? '↑' : '↓') : ''}
        </div>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSort('price')}>
          價格 {sortBy === 'price' ? (sortAsc ? '↑' : '↓') : ''}
        </div>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSort('stock')}>
          庫存 {sortBy === 'stock' ? (sortAsc ? '↑' : '↓') : ''}
        </div>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSort('status')}>
          狀態 {sortBy === 'status' ? (sortAsc ? '↑' : '↓') : ''}
        </div>
        <div style={{ flex: 2 }}>操作</div>
      </div>

      {pageProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20 }}>尚無符合條件的商品</div>
      ) : (
        pageProducts.map(p => {
          const mainImageObj = Array.isArray(p.productImageDtos)
            ? p.productImageDtos.find(img => img.number === -1)
            : null;
          const mainImageUrl = mainImageObj?.imageUrl ? `${BASE_URL}${mainImageObj.imageUrl}` : null;

          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                padding: '8px 0',
              }}
            >
              <div style={{ flex: 1 }}>{p.id}</div>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                {mainImageUrl ? (
                  <img
                    src={mainImageUrl}
                    alt={p.name}
                    style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${p.id}`)}
                  />
                ) : (
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: '#ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: '#666',
                    }}
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    無圖片
                  </div>
                )}
                <span
                  style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  {p.name}
                </span>
              </div>
              <div style={{ flex: 1 }}>NT$ {p.price}</div>
              <div style={{ flex: 1 }}>{p.stock}</div>
              <div
                style={{
                  flex: 1,
                  color: p.status === 'ACTIVE' ? 'green' : 'gray',
                  fontWeight: 'bold',
                }}
              >
                {p.status === 'ACTIVE' ? '上架中' : '下架中'}
              </div>
              <div style={{ flex: 2, display: 'flex', gap: 8 }}>
                <button onClick={() => toggleStatus(p.id, p.status)}>
                  {p.status === 'ACTIVE' ? '下架' : '上架'}
                </button>
                <button onClick={() => deleteProduct(p.id)}>刪除</button>
                <button onClick={() => navigate(`/admin/products/edit/${p.id}`)}>編輯</button>
              </div>
            </div>
          );
        })
      )}

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          上一頁
        </button>
        <span>
          第 {currentPage} 頁 / 共 {totalPage} 頁
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
          disabled={currentPage === totalPage}
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

export default AdminProductListPage;
