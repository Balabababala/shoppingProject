import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';  // 你之前寫的商品卡元件

function SearchPage() {
  const BASE_API = "http://localhost:8080/api";

  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 12;

  // 搜尋結果總頁數
  const totalPages = Math.ceil(products.length / pageSize);

  // 目前頁面商品列表切割
  const pagedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 取得搜尋結果的函式
  const fetchProducts = (searchKeyword) => {
    fetch(`${BASE_API}/products?search=${encodeURIComponent(searchKeyword)}`)
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

  // 搜尋按鈕點擊或 Enter 鍵觸發
  const handleSearch = () => {
    if (keyword.trim()) {
      fetchProducts(keyword.trim());
    } else {
      setProducts([]);
    }
  };

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  const handleAddToCart = (product) => {
    console.log('加入購物車', product);
  };

  // Enter 鍵觸發搜尋
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
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
            {pagedProducts.map(p => (
              <div key={p.id} className="col">
                <ProductCard product={p} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>

          {/* 分頁 */}
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => changePage(currentPage - 1)}>
                  {'<'}
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - currentPage) <= 1;
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                      <li className={`page-item ${currentPage === p ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => changePage(p)}>
                          {p}
                        </button>
                      </li>
                    </React.Fragment>
                  );
                })}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => changePage(currentPage + 1)}>
                  {'>'}
                </button>
              </li>
            </ul>
          </nav>

          {/* 頁碼輸入跳轉 */}
          <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              placeholder="輸入頁碼"
              className="form-control"
              style={{ width: '100px' }}
            />
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                const num = parseInt(inputPage, 10);
                if (!isNaN(num)) {
                  changePage(num);
                  setInputPage('');
                }
              }}
            >
              跳頁
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
