import React, { useState, useEffect ,useContext} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ModernProductCard from '../ModernProductCard.jsx';
import { AppContext } from '../../contexts/AppContext';

function SearchPage() {
  const BASE_API = "http://localhost:8080/api";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const keywordParam = searchParams.get('keyword') || '';
  const { userData, addToastMessage, setCartItems ,} = useContext(AppContext);
  const [keyword, setKeyword] = useState(keywordParam);
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 12;

  const totalPages = Math.ceil(products.length / pageSize);
  const pagedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const fetchProducts = (searchKeyword) => {
    fetch(`${BASE_API}/products/search?keyword=${encodeURIComponent(searchKeyword)}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setCurrentPage(1);
      })
      .catch(err => {
        console.error('搜尋商品失敗', err);
        setProducts([]);
      });
  };

  // 加入購物車事件
  const handleAddToCart = (productId, quantity) => {
    if (!userData) {
      addToastMessage('請先登入才能加入購物車！');
      return;
    }
    let qty = quantity;
    if (isNaN(qty) || qty < 1) qty = 1;

    fetch(`${BASE_API}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: userData.userId,
        productId,
        quantity: qty,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`加入購物車失敗，狀態碼:${res.status}`);
        return res.json();
      })
      .then(() => {
        addToastMessage(`已加入購物車：商品ID ${productId} x ${qty}`);
        return fetch(`${BASE_API}/cart`, { credentials: 'include' });
      })
      .then(res => res.json())
      .then(data => {
        if (!data || !data.data) throw new Error('購物車資料格式錯誤');
        setCartItems(data.data);
      })
      .catch(err => {
        addToastMessage(err.message);
      });
  };

  useEffect(() => {
    if (keywordParam.trim()) {
      setKeyword(keywordParam);
      fetchProducts(keywordParam);
    } else {
      setProducts([]);
    }
  }, [keywordParam]);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (trimmed) {
      fetchProducts(trimmed);
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      setProducts([]);
      navigate('/search');
    }
  };

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 960 }}>
      <h1 className="mb-4 text-center" style={{ color: '#222' }}>商品搜尋</h1>

      <div className="input-group mb-4" style={{ maxWidth: 600, margin: '0 auto' }}>
        <input
          type="text"
          className="form-control"
          placeholder="請輸入商品關鍵字"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ borderRadius: '0.375rem 0 0 0.375rem', borderRight: 'none' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          style={{ borderRadius: '0 0.375rem 0.375rem 0', transition: 'background-color 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
        >
          搜尋
        </button>
      </div>

      {pagedProducts.length === 0 ? (
        <p className="text-center text-muted fs-5">沒有找到相關商品</p>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {pagedProducts.map(product => (
              <div key={product.id} className="col">
                <ModernProductCard 
                product={product}
                mode="cart"
                onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>

          {/* 分頁控制 */}
          <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              上一頁
            </button>

            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              placeholder={currentPage}
              style={{
                width: '4.5rem',
                textAlign: 'center',
                borderRadius: '0.375rem',
                border: '1px solid #ced4da',
                outlineOffset: 0,
                outlineColor: '#80bdff',
                outlineStyle: 'auto',
                outlineWidth: 1,
              }}
              onChange={e => setInputPage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const pageNum = Number(inputPage);
                  if (!isNaN(pageNum)) changePage(pageNum);
                  setInputPage('');
                }
              }}
            />

            <span style={{ userSelect: 'none' }}> / {totalPages} 頁</span>

            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              下一頁
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
