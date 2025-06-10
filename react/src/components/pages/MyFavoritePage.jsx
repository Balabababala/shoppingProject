import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import ModernProductCard from '../ModernProductCard';

function MyFavorite() {
  const BASE_API="http://localhost:8080/api";
  const { userData, addToastMessage } = useContext(AppContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 6;

  const totalPages = Math.ceil(favorites.length / pageSize);
  const pagedFavorites = favorites.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const fetchFavorites = async () => {
    if (!userData?.userId) {
      setFavorites([]);
      setError("尚未登入，無法取得收藏清單");
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`${BASE_API}/favorites/${userData.userId}/favorites`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!resp.ok) throw new Error('取得收藏失敗');
      const data = await resp.json();

      if (data.message && data.message.includes("成功")) {
        setFavorites(data.data || []);
        setError(null);
        setCurrentPage(1);
      } else {
        setError(data.message || '取得收藏失敗');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userData?.userId]);

   const handleDelete = async (productId) => {
    try {
      const resp = await fetch(`${BASE_API}/favorites/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await resp.json();

      if (data.message && data.message.includes("成功")) {
        setFavorites((prev) => prev.filter(item => item.productId !== productId));
        if ((pagedFavorites.length === 1) && (currentPage > 1)) {
          setCurrentPage(currentPage - 1);
        }
        addToastMessage('刪除收藏成功');
      } else {
        addToastMessage(data.message || '刪除失敗');
      }
    } catch {
      addToastMessage('刪除失敗');
    }
  };

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  if (loading) return <p className="text-center mt-3">載入中...</p>;
  if (error) return <p className="text-center text-danger mt-3">錯誤：{error}</p>;

  return (
    <div className="container my-4" style={{ maxWidth: 900 }}>
      <h2 className="mb-4 text-center" style={{ color: '#222' }}>我的收藏商品</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-muted">你還沒有收藏任何商品。</p>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {pagedFavorites.map(product => (
              <div key={product.productId} className="col">
                <ModernProductCard
                  product={product}
                  mode="favorite"
                  onDeleteFavorite={handleDelete}
                />
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
              style={{ width: '4rem', textAlign: 'center', borderRadius: '0.25rem', border: '1px solid #ced4da' }}
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

export default MyFavorite;
