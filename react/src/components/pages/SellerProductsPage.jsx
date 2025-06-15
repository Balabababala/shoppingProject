import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import '../../css/SellerProductsPage.css';

const API_BASE = 'http://localhost:8080/api';
const PAGE_SIZE = 5;

export default function SellerProductsPage() {
  const { userData, fetchWithAuthCheck, addToastMessage } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  const fetchSellerProducts = async () => {
    if (!userData) {
      addToastMessage('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/seller/products`);
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.data) {
        setProducts(res.data);
        setCurrentPage(1);
      } else {
        addToastMessage('取得商品失敗');
      }
    } catch {
      addToastMessage('取得商品時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [userData]);

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

  const filtered = sortedProducts.filter(p => {
    const kw = searchKeyword.trim().toLowerCase();
    return kw === '' || p.name?.toLowerCase().includes(kw) || String(p.id).includes(kw);
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  const toggleStatus = async (id, status) => {
    if (!userData) {
      addToastMessage('請先登入');
      return;
    }
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const url = `${API_BASE}/seller/products/${id}/${newStatus === 'ACTIVE' ? 'active' : 'unactive'}`;
    try {
      const res = await fetchWithAuthCheck(url, { method: 'PUT' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage(`商品已${newStatus === 'ACTIVE' ? '上架' : '下架'}`);
        fetchSellerProducts();
      } else {
        addToastMessage('商品狀態變更失敗');
      }
    } catch {
      addToastMessage('變更商品狀態時發生錯誤');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('確定要刪除此商品？')) return;
    if (!userData) {
      addToastMessage('請先登入');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/seller/products/${id}`, { method: 'DELETE' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('商品已刪除');
        fetchSellerProducts();
      } else {
        addToastMessage('刪除商品失敗');
      }
    } catch {
      addToastMessage('刪除商品時發生錯誤');
    }
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (!userData) return <div className="not-logged-in">請先登入才能管理賣家商品。</div>;

  return (
    <div className="seller-products-container">
      <h2 className="seller-products-header">賣家商品管理</h2>

      <div className="top-actions">
        <button className="btn-new-product" onClick={() => navigate('/seller/products/new')}>
          新增商品
        </button>
        <input
          className="search-input"
          type="text"
          placeholder="快速搜尋商品名稱或ID"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="product-header">
        <button onClick={() => handleSort('name')}>商品名稱 {sortBy === 'name' ? (sortAsc ? '↑' : '↓') : ''}</button>
        <button onClick={() => handleSort('price')}>價格 {sortBy === 'price' ? (sortAsc ? '↑' : '↓') : ''}</button>
        <button onClick={() => handleSort('stock')}>庫存 {sortBy === 'stock' ? (sortAsc ? '↑' : '↓') : ''}</button>
        <button onClick={() => handleSort('status')}>狀態 {sortBy === 'status' ? (sortAsc ? '↑' : '↓') : ''}</button>
        <div>操作</div>
      </div>

      {pageProducts.length === 0 ? (
        <div className="no-products">尚無符合條件的商品</div>
      ) : (
        pageProducts.map((p) => {
          const mainImageObj = Array.isArray(p.productImageDtos)
            ? p.productImageDtos.find(img => img.number === -1)
            : null;
          const mainImageUrl = mainImageObj?.imageUrl ? `http://localhost:8080${mainImageObj.imageUrl}` : null;

          return (
            <div key={p.id} className="product-row">
              <div className="product-info">
                {mainImageUrl ? (
                  <img
                    src={mainImageUrl}
                    alt={p.name}
                    className="product-img"
                    onClick={() => navigate(`/products/${p.id}`)}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <div
                    className="no-img"
                    onClick={() => navigate(`/products/${p.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    無圖片
                  </div>
                )}
                <span
                  className="product-name-link"
                  onClick={() => navigate(`/products/${p.id}`)}
                  style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                >
                  {p.name}
                </span>
              </div>
              <div>NT$ {p.price}</div>
              <div>{p.stock}</div>
              <div className={p.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}>
                {p.status === 'ACTIVE' ? '上架中' : '下架中'}
              </div>
              <div className="action-btns">
                <button
                  className={p.status === 'ACTIVE' ? 'btn-status off' : 'btn-status on'}
                  onClick={() => toggleStatus(p.id, p.status)}
                >
                  {p.status === 'ACTIVE' ? '下架' : '上架'}
                </button>
                <button className="btn-delete" onClick={() => deleteProduct(p.id)}>
                  刪除
                </button>
                <button className="btn-edit" onClick={() => navigate(`/seller/products/edit/${p.id}`)}>
                  編輯
                </button>
              </div>
            </div>
          );
        })
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          上一頁
        </button>
        <span>
          第 {currentPage} 頁 / 共 {totalPage} 頁
        </span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))} disabled={currentPage === totalPage}>
          下一頁
        </button>
      </div>
    </div>
  );
}
