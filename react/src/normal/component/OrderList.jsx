
import React from "react";

const OrderList = ({ orders, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">我的訂單</h2>
      <ul className="border rounded shadow p-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="cursor-pointer p-2 hover:bg-gray-100 border-b"
            onClick={() => onSelect(order)}
          >
            <div>訂單編號：{order.id}</div>
            <div>日期：{order.date}</div>
            <div>金額：${order.amount}</div>
            <div>狀態：{order.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
