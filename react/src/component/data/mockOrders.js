// src/data/mockOrders.js

const productNames = ["商品A", "商品B", "商品C", "商品D", "商品E"];
const statuses = ["處理中", "已出貨", "已取消", "完成"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
}

function generateOrders(count) {
  const orders = [];
  for (let i = 1; i <= count; i++) {
    const itemsCount = randomInt(1, 5);
    const items = [];
    let amount = 0;
    for (let j = 0; j < itemsCount; j++) {
      const name = productNames[randomInt(0, productNames.length - 1)];
      const quantity = randomInt(1, 3);
      const price = randomInt(100, 1000);
      amount += quantity * price;
      items.push({ name, quantity, price });
    }
    orders.push({
      id: `ORD${String(i).padStart(3, "0")}`,
      date: randomDate(new Date(2024, 0, 1), new Date()),
      status: statuses[randomInt(0, statuses.length - 1)],
      amount,
      items,
    });
  }
  return orders;
}

export const mockOrders = generateOrders(100);
