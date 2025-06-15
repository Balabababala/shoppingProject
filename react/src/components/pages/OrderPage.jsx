import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

function MyOrdersPage() {
  const BASE_API = "http://localhost:8080/api";
  const { userData, fetchWithAuthCheck, addToastMessage } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const pageSize = 5;

  const filteredOrders = orders.filter(order => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;
    if (String(order.id).includes(keyword)) return true;
    if (order.receiverName?.toLowerCase().includes(keyword)) return true;
    if (order.items.some(item => item.productName.toLowerCase().includes(keyword))) return true;
    return false;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const pagedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData) {
        addToastMessage("請先登入以查看訂單");
        setOrders([]);
        return;
      }

      const data = await fetchWithAuthCheck(`${BASE_API}/orders/${userData.userId}`);
      if (data?.data) {
        setOrders(data.data);
        setCurrentPage(1);
      } else {
        addToastMessage(data?.message || "取得訂單失敗");
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userData, fetchWithAuthCheck, addToastMessage]);

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(pageNum);
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("確定要取消這筆訂單嗎？")) return;

    try {
      const res = await fetch(`${BASE_API}/orders/${orderId}/cancel`, {
        method: 'PUT',
        credentials: 'include',
      });

      const result = await res.json();
      if (res.ok) {
        addToastMessage("訂單已成功取消");
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, orderStatus: 'CANCELED' } : order
          )
        );
      } else {
        addToastMessage(result.message || "取消失敗");
      }
    } catch (error) {
      addToastMessage("取消訂單時發生錯誤");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 960 }}>
      <h1 className="mb-4 text-center" style={{ color: '#222' }}>我的訂單</h1>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="搜尋訂單編號、收件人、商品名稱"
        value={searchKeyword}
        onChange={e => {
          setSearchKeyword(e.target.value);
          setCurrentPage(1);
        }}
      />

      {pagedOrders.length === 0 ? (
        <p className="text-center text-muted fs-5">目前沒有訂單紀錄</p>
      ) : (
        <>
          {pagedOrders.map(order => (
            <div key={order.id} className="card mb-4 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                <span>訂單編號 #{order.id}</span>
                <span>{new Date(order.orderDate).toLocaleString()}</span>
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-md-4">
                    <strong>訂單狀態：</strong> {order.orderStatus}
                  </div>
                  <div className="col-md-4">
                    <strong>付款狀態：</strong> {order.paymentStatus}
                  </div>
                  <div className="col-md-4">
                    <strong>出貨狀態：</strong> {order.shipmentStatus}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>收件人：</strong> {order.receiverName} ({order.receiverPhone})
                  </div>
                  <div className="col-md-6">
                    <strong>地址：</strong> {order.shippingAddress}
                  </div>
                </div>
                <h5 className="mb-3">商品明細</h5>
                <table className="table table-bordered table-sm">
                  <thead className="thead-light">
                    <tr>
                      <th>商品名稱</th>
                      <th>數量</th>
                      <th>單價</th>
                      <th>小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>${item.unitPrice}</td>
                        <td>${item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <strong>訂單總金額：</strong>{" "}
                    <span className="fs-5 text-danger">${order.totalAmount}</span>
                  </div>
                  {(order.orderStatus === "PENDING" || order.orderStatus === "PAID") && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancel(order.id)}
                    >
                      取消訂單
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

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

export default MyOrdersPage;
