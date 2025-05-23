import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
          {/* 遞迴渲染子分類 */}
          {cat.children && cat.children.length > 0 && (
            <CategoryTree categories={cat.children} selectedSlug={selectedSlug} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
}

function CategoryPage() {
  const BASE_API = "http://localhost:8080/api";
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categoriesTree, setCategoriesTree] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(slug);
  const [products, setProducts] = useState([]);

  // 取得分類樹 (包含多層子分類)
  useEffect(() => {
    fetch(`${BASE_API}/categories/${slug}/tree`)
      .then(res => res.json())
      .then(data => setCategoriesTree(data.data))
      .catch(err => console.error('取得分類樹失敗', err));
  }, [slug]);

  // 取得產品
  useEffect(() => {
    fetch(`${BASE_API}/products?category=${selectedCategory}`)
      .then(res => res.json())
      .then(data => setProducts(data.data))
      .catch(err => console.error('取得商品失敗', err));
  }, [selectedCategory]);

  // 選擇分類
  const handleSelectCategory = (categorySlug) => {
    setSelectedCategory(categorySlug);
    // 你也可以改用 navigate 切換網址，例如：
    // navigate(`/category/${categorySlug}`);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: 10 }}>分類：{selectedCategory}</h1>

      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        {/* 左側分類樹選單 */}
        <aside style={{ minWidth: 250, borderRight: '1px solid #ccc', paddingRight: 15 }}>
          <h2 style={{ fontSize: 18, marginBottom: 15 }}>所有分類</h2>
          <CategoryTree
            categories={categoriesTree}
            selectedSlug={selectedCategory}
            onSelect={handleSelectCategory}
          />
          <div
            onClick={() => handleSelectCategory(null)}
            style={{
              marginTop: 10,
              cursor: 'pointer',
              color: selectedCategory === null ? '#007bff' : '#333',
              fontWeight: selectedCategory === null ? 'bold' : 'normal',
              userSelect: 'none'
            }}
          >
            全部商品
          </div>
        </aside>

        {/* 右側商品清單 */}
        <section style={{ flex: 1 }}>
          {products.length === 0 ? (
            <p style={{ fontSize: 18, color: '#666' }}>沒有商品</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
              {products.map(p => (
                <div key={p.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 15,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
                  />
                  <h3 style={{ fontSize: 18, margin: '0 0 8px' }}>{p.name}</h3>
                  <p style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: 16 }}>${p.price}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CategoryPage;
