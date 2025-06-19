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
  const [inputPage, setInputPage] = useState(''); //分頁
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

  // 刪除商品（軟刪除）
  const softDeleteProduct = async (id) => {
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

  // 復原商品
  const restoreProduct = async (id) => {
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/products/${id}/restore`, { method: 'PUT' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('商品已復原');
        fetchProducts();
      } else {
        addToastMessage('復原商品失敗');
      }
    } catch {
      addToastMessage('復原商品時發生錯誤');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>載入中...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!adminUserData) return <div style={{ padding: 20 }}>請先登入才能管理商品</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>管理員商品列表</h2>

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/admin/products/new')}>新增商品</button>
        <input
          type="text"
          placeholder="搜尋商品名稱或ID"
          value={searchKeyword}
          onChange={e => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            flexGrow: 1,
            maxWidth: 300,
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 14,
          }}
        />
      </div>

      {/* 表格標題列 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60px 2fr 100px 80px 100px 80px 220px',
          fontWeight: 'bold',
          borderBottom: '2px solid #333',
          paddingBottom: 6,
          cursor: 'default',
        }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('id')}
          aria-label="依商品ID排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSort('id'); }}
        >
          商品ID {sortBy === 'id' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('name')}
          aria-label="依商品名稱排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSort('name'); }}
        >
          商品名稱 {sortBy === 'name' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('price')}
          aria-label="依價格排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSort('price'); }}
        >
          價格 {sortBy === 'price' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('stock')}
          aria-label="依庫存排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSort('stock'); }}
        >
          庫存 {sortBy === 'stock' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('status')}
          aria-label="依狀態排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSort('status'); }}
        >
          狀態 {sortBy === 'status' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div>刪除狀態</div>
        <div>操作</div>
      </div>

      {/* 商品列表 */}
      {pageProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>尚無符合條件的商品</div>
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
                display: 'grid',
                gridTemplateColumns: '60px 2fr 100px 80px 100px 80px 220px',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                padding: '12px 0',
              }}
            >
              <div>{p.id}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {mainImageUrl ? (
                  <img
                    src={mainImageUrl}
                    alt={p.name}
                    style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer', borderRadius: 4 }}
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
                      borderRadius: 4,
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
              <div>NT$ {p.price}</div>
              <div>{p.stock}</div>
              <div style={{ color: p.status === 'ACTIVE' ? 'green' : 'gray', fontWeight: 'bold' }}>
                {p.status === 'ACTIVE' ? '上架中' : '下架中'}
              </div>
              <div style={{ color: p.isDeleted ? 'red' : 'black' }}>
                {p.isDeleted ? '已刪除' : '正常'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleStatus(p.id, p.status)}>
                  {p.status === 'ACTIVE' ? '下架' : '上架'}
                </button>
                {!p.isDeleted && <button onClick={() => softDeleteProduct(p.id)}>刪除</button>}
                {p.isDeleted && <button onClick={() => restoreProduct(p.id)}>復原</button>}
                <button onClick={() => navigate(`/admin/products/edit/${p.id}`)}>編輯</button>
              </div>
            </div>
          );
        })
      )}

      {/* 分頁控制 */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          fontSize: 14,
        }}
      >
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          style={{ padding: '6px 12px' }}
        >
          上一頁
        </button>

        <input
          type="number"
          min="1"
          max={totalPage}
          value={inputPage}
          placeholder={currentPage.toString()}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const pageNum = Number(inputPage);
              if (!isNaN(pageNum)) {
                const target = Math.max(1, Math.min(totalPage, pageNum));
                setCurrentPage(target);
                setInputPage('');
              }
            }
          }}
          style={{
            width: '4.5rem',
            textAlign: 'center',
            padding: '4px 6px',
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />

        <span style={{ userSelect: 'none' }}>
          / 共 {totalPage} 頁
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
          disabled={currentPage === totalPage}
          style={{ padding: '6px 12px' }}
        >
          下一頁
        </button>
      </div>
                  
    </div>
  );
}

export default AdminProductListPage;
