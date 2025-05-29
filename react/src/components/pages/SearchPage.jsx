import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { AppContext } from '../../contexts/AppContext';  // 這行要加

function SearchPage() {
  const BASE_API = "http://localhost:8080/api";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { userData,setToastMessage } = useContext(AppContext);  // 從 Context 拿 setToastMessage

  const keywordParam = searchParams.get('keyword') || '';
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

  const handleAddToCart = (product) => {
          if (!userData) {
        setToastMessage('請先登入才能加入購物車');
        return;
      }

      console.log("加入購物車", product);
      setToastMessage(`${product.name} 已加入購物車`);
      // 這裡放你的加入購物車邏輯，例如呼叫 API 還沒放
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
    <div className="container mt-4">
      <h1>商品搜尋</h1>

      <div className="input-group mb-3" style={{ maxWidth: 600 }}>
        <input
          type="text"
          className="form-control"
          placeholder="請輸入商品關鍵字"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch}>搜尋</button>
      </div>

      {pagedProducts.length === 0 ? (
        <p className="text-muted fs-5">沒有找到相關商品</p>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {pagedProducts.map(product => (
              <div key={product.id} className="col">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}  // 傳入函式，不要加括號喔
                />
              </div>
            ))}
          </div>

          {/* 分頁 */}
          <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
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
              style={{ width: '4rem', textAlign: 'center' }}
              onChange={e => setInputPage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const pageNum = Number(inputPage);
                  if (!isNaN(pageNum)) changePage(pageNum);
                  setInputPage('');
                }
              }}
            />

            <span> / {totalPages} 頁</span>

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
