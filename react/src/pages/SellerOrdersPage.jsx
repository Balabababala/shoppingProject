import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts/AppContext";

function SellerOrdersPage() {
  const { userData, fetchWithAuthCheck, addToastMessage, API_BASE } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 5;

  // 取得訂單資料
  async function fetchOrders() {
    if (!userData || !userData.user?.userId) {
      console.log("No userData or userId, clearing orders");
      addToastMessage("請先登入以查看訂單");
      setOrders([]);
      return;
    }

    try {
      console.log("Fetching orders for userId:", userData.user.userId);
      const data = await fetchWithAuthCheck(`${API_BASE}/seller/orders/${userData.user.userId}`);
      console.log("Fetch orders response:", data);
      if (data?.data && Array.isArray(data.data)) {
        const newOrders = data.data.map(o => ({ ...o, items: [...o.items] })); // 深拷貝訂單和項目
        console.log("New orders:", newOrders);
        setOrders(newOrders);
        setCurrentPage(1);
      } else {
        console.error("Invalid data structure:", data);
        addToastMessage(data?.message || "取得訂單失敗");
        setOrders([]);
      }
    } catch (error) {
      console.error('fetchOrders 發生錯誤:', error);
      addToastMessage("取得訂單發生錯誤");
      setOrders([]);
    }
  }

  useEffect(() => {
    console.log("Initial fetchOrders on mount");
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("userData changed:", userData);
    if (userData) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [userData]);

  const filteredOrders = orders.filter(order => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;
    if (String(order.id).includes(keyword)) return true;
    if (order.buyerName?.toLowerCase().includes(keyword)) return true;
    if (order.items.some(item => item.productName?.toLowerCase().includes(keyword))) return true;
    if (order.orderDate && new Date(order.orderDate).toLocaleDateString().toLowerCase().includes(keyword)) return true;
    return false;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const pagedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changePage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    console.log("Changing page to:", pageNum);
    setCurrentPage(pageNum);
    setInputPage('');
  };


  const handleMarkShipped = async (orderId) => {
    try {
      console.log("Marking order as shipped:", orderId);
      const res = await fetchWithAuthCheck(`${API_BASE}/seller/orders/${orderId}/ship`, { method: 'PUT' });
      console.log("Mark shipped response:", res);
      if (res?.data) {
        addToastMessage("已標記出貨");
        await fetchOrders(); // 重新獲取訂單資料
      } else {
        addToastMessage(res?.message || "標記出貨失敗");
      }
    } catch (error) {
      console.error("標記出貨發生錯誤:", error);
      addToastMessage("標記出貨發生錯誤");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("你確定要取消這筆訂單嗎？取消後將不可復原！");
    if (!confirmCancel) return;

    try {
      console.log("Cancelling order:", orderId);
      const res = await fetchWithAuthCheck(`${API_BASE}/seller/orders/${orderId}/cancel`, { method: 'PUT' });
      console.log("Cancel order response:", res);
      if (res?.message === "訂單已成功取消") {
        addToastMessage("訂單已取消");
        // 臨時本地更新，立即反映取消狀態
        // setOrders(prev =>
        //   prev.map(order =>
        //     order.id === orderId
        //       ? { ...order, orderStatus: "CANCELLED", paymentStatus: "REFUNDED", shipmentStatus: "NOT_SHIPPED" }
        //       : { ...order }
        //   )
        // );
        // 重新獲取訂單資料，確保與後端同步
        await fetchOrders();
      } else {
        addToastMessage(res?.message || "取消訂單失敗");
      }
    } catch (error) {
      console.error("取消訂單發生錯誤:", error);
      addToastMessage("取消訂單發生錯誤");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 960 }}>
      <h1 className="mb-4 text-center" style={{ color: '#222' }}>賣家訂單管理</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="快速搜尋：訂單編號、買家名稱或商品名稱"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
      </div>

      {pagedOrders.length === 0 ? (
        <p className="text-center text-muted fs-5">目前沒有符合條件的訂單紀錄</p>
      ) : (
        <>
          {pagedOrders.map(order => (
            <div key={order.id} className="card mb-4 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
                <div>
                  <div>訂單編號 <strong>#{order.id}</strong></div>
                  <div style={{ fontSize: '0.9rem' }}>
                    買家：{order.buyerName || order.receiverName || ''}
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem' }}>
                  {order.orderDate ? new Date(order.orderDate).toLocaleString() : '未知日期'}
                </span>
              </div>

              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-md-4"><strong>訂單狀態：</strong>{order.orderStatus}</div>
                  <div className="col-md-4"><strong>付款狀態：</strong>{order.paymentStatus}</div>
                  <div className="col-md-4"><strong>出貨狀態：</strong>{order.shipmentStatus}</div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-4"><strong>付款方式：</strong>{order.paymentMethod}</div>
                  <div className="col-md-4"><strong>運送方式：</strong>{order.shippingMethod}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6"><strong>收件人：</strong>{order.receiverName}（{order.receiverPhone}）</div>
                  <div className="col-md-6"><strong>地址：</strong>{order.shippingAddress}</div>
                </div>

                {order.notes && (
                  <div className="mb-3"><strong>備註：</strong>{order.notes}</div>
                )}

                <h5 className="mb-3">商品明細</h5>
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr><th>商品名稱</th><th>數量</th><th>單價</th><th>小計</th></tr>
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

                <div className="text-end mt-3">
                  <strong>訂單總金額：</strong>
                  <span className="fs-5 text-danger"> ${order.totalAmount}</span>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  {(order.orderStatus !== "SHIPPED" && order.orderStatus !== "CANCELLED") && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleMarkShipped(order.id)}
                    >
                      標記出貨
                    </button>
                  )}
                  {order.orderStatus !== "CANCELLED" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancelOrder(order.id)}
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
              className="btn btn-outline-success"
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
              placeholder={String(currentPage)}
              style={{ width: '4.5rem', textAlign: 'center' }}
              onChange={e => setInputPage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const pageNum = parseInt(inputPage);
                  if (!isNaN(pageNum)) changePage(pageNum);
                }
              }}
            />

            <span style={{ userSelect: 'none' }}>/ {totalPages} 頁</span>

            <button
              className="btn btn-outline-success"
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

export default SellerOrdersPage;