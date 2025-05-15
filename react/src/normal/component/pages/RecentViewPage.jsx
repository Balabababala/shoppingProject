import React from 'react';
import '../../css/RecentViewPage.css';
import ProductList from '../ProductList.jsx'; 

function RecentlyViewedPage() {
  const recentlyViewedProducts = [
    {
      id: 101,
      name: '最近看過商品 A',
      price: 150,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 102,
      name: '最近看過商品 B',
      price: 250,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 103,
      name: '最近看過商品 C',
      price: 350,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  // 檢查 products 資料是否正確
  console.log(recentlyViewedProducts);

  return (
    <div className="container py-5">
      <h2>最近看過</h2>
      {/* 確保 ProductList 正確接收到 products */}
      {recentlyViewedProducts.length > 0 ? (
        <ProductList products={recentlyViewedProducts} />
      ) : (
        <p>目前沒有最近看過的商品。</p>
      )}
    </div>
  );
}

export default RecentlyViewedPage;
