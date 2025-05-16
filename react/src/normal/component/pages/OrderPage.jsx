
import React, { useState } from "react";
import { mockOrders } from "../data/mockOrders"; //假資料
import OrderList from "../OrderList.jsx";
import OrderDetail from "../OrderDetail.jsx";

const OrderPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {!selectedOrder ? (
        <OrderList orders={mockOrders} onSelect={setSelectedOrder} />
      ) : (
        <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrderPage;
