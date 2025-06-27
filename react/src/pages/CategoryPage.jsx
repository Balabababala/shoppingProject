import React, { useEffect, useState, useContext } from 'react';
import ModernProductCard from '../components/ModernProductCard';
import { AppContext } from '../contexts/AppContext';
import { useParams, useLocation } from 'react-router-dom';




function CategoryTree({ categories, selectedSlug, onSelect }) {
  if (!categories || categories.length === 0) return null;

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 15 }}>
      {categories.map(cat => (
        <li key={cat.slug} style={{ marginBottom: 6 }}>
          <div
            onClick={() => onSelect(cat.slug)}
            style={{
              cursor: 'pointer',
              padding: '6px 10px',
              backgroundColor: selectedSlug === cat.slug ? '#007bff' : 'transparent',
              color: selectedSlug === cat.slug ? '#fff' : '#333',
              borderRadius: 4,
              userSelect: 'none',
              fontWeight: selectedSlug === cat.slug ? 'bold' : 'normal'
            }}
          >
            {cat.name}
          </div>
          {cat.children && cat.children.length > 0 && (
            <CategoryTree
              categories={cat.children}
              selectedSlug={selectedSlug}
              onSelect={onSelect}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function findCategoryName(tree, slug) {
  for (const category of tree) {
    if (category.slug === slug) {
      return category.name;
    }
    if (category.children && category.children.length > 0) {
      const name = findCategoryName(category.children, slug);
      if (name) return name;
    }
  }
  return null;
}

function CategoryPage() {
  const { slug } = useParams();
  const { userData, addToastMessage, addToCart, API_BASE } = useContext(AppContext);

  const [categoriesTree, setCategoriesTree] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(slug || null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 12;

  const location = useLocation();
  const passedName = location.state?.name;
  const [selectedCategoryName, setSelectedCategoryName] = useState(passedName || '全部商品');

  useEffect(() => {
    setSelectedCategory(slug || null);
  }, [slug]);

  useEffect(() => {
  const name = findCategoryName(categoriesTree, slug);
  if (location.state?.name) {
    setSelectedCategoryName(location.state.name);
  } else {
    setSelectedCategoryName(name || '全部商品');
  }
}, [categoriesTree, slug, location.state]);

  useEffect(() => {
    fetch(`${API_BASE}/categories/${slug || ''}/tree`)
      .then(res => {
        if (!res.ok) throw new Error('無法載入分類樹');
        return res.json();
      })
      .then(data => setCategoriesTree(data.data))
      .catch(err => {
        console.error('取得分類樹失敗', err);
        addToastMessage('無法載入分類，請稍後再試！');
      });
  }, [slug, API_BASE, addToastMessage]);

  useEffect(() => {
    const categoryQuery = selectedCategory ? `?category=${selectedCategory}` : '';
    fetch(`${API_BASE}/products${categoryQuery}`, {
      headers: {
        'Authorization': `Bearer ${userData?.token || ''}` // 若需要 JWT
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`無法載入商品: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data.data || []);
        setCurrentPage(1);
      })
      .catch(err => {
        console.error('取得商品失敗', err);
        addToastMessage('無法載入商品，請稍後再試！');
        setProducts([]);
      });
  }, [selectedCategory, API_BASE, userData, addToastMessage]);

  const totalPages = products ? Math.ceil(products.length / pageSize) : 0;
  const pagedProducts = products
    ? products.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const handleSelectCategory = (categorySlug) => {
    setSelectedCategory(categorySlug);
    const name = findCategoryName(categoriesTree, categorySlug);
    setSelectedCategoryName(name || '全部商品');
  };

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  const handleAddToCart = (productId, quantity) => {
    if (!userData) {
      addToastMessage('請先登入才能加入購物車！');
      return;
    }
    addToCart(productId, quantity);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">分類：{selectedCategoryName}</h1>
      <div className="row">
        <aside className="col-md-3 border-end pe-3">
          <h5>所有分類</h5>
          <CategoryTree
            categories={categoriesTree}
            selectedSlug={selectedCategory}
            onSelect={handleSelectCategory}
          />
          <div
            onClick={() => handleSelectCategory(null)}
            className={`mt-3 ${selectedCategory === null ? 'fw-bold text-primary' : ''}`}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            全部商品
          </div>
        </aside>

        <section className="col-md-9">
          {pagedProducts.length === 0 ? (
            <p className="text-muted fs-5">沒有商品</p>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {pagedProducts.map(p => (
                  <div key={p.id} className="col">
                    <ModernProductCard
                      product={p}
                      mode="cart"
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>

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
        </section>
      </div>
    </div>
  );
}

export default CategoryPage;