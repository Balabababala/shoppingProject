
import React from "react";

const OrderDetail = ({ order, onBack }) => {
  if (!order) return null;

  return (
    <div className="mt-4 p-4 border rounded shadow bg-white">
      <button onClick={onBack} className="mb-2 text-blue-600 underline">← 返回列表</button>
      <h3 className="text-lg font-semibold mb-2">訂單詳情 - {order.id}</h3>
      <div>日期：{order.date}</div>
      <div>狀態：{order.status}</div>
      <div>總金額：${order.amount}</div>
      <hr className="my-2" />
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} x {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
