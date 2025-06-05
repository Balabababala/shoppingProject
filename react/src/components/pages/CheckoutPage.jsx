import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import axios from "axios";

export default function CheckoutPage() {
  const { setCartItems ,addToastMessage} = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    shippingAddress: "",
    paymentMethod: "credit_card",
    shippingMethod: "home_delivery",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  // 載入使用者預設訂單資訊
  useEffect(() => {
    async function fetchDefaultOrderInfo() {
      try {
        const res = await axios.get("/api/user/default-order-info");
        if (res.data.data) {
          setForm({
            receiverName: res.data.data.receiverName || "",
            receiverPhone: res.data.data.receiverPhone || "",
            shippingAddress: res.data.data.shippingAddress || "",
            paymentMethod: res.data.data.paymentMethod || "credit_card",
            shippingMethod: res.data.data.shippingMethod || "home_delivery",
            notes: res.data.data.notes || "",
          });
        }
      } catch (error) {
        console.error("抓取預設訂單資訊失敗", error);
      } finally {
        setLoadingUserInfo(false);
      }
    }
    fetchDefaultOrderInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/order/create", form);
      setCartItems([]);  // 清空購物車狀態
      addToastMessage(res.data.message || "訂單送出成功！");
      navigate("/cart");  // 跳轉回購物車頁面
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        "未知錯誤，請稍後再試。";
      addToastMessage("結帳失敗：" + msg);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUserInfo) {
    return <div className="text-center p-4">載入使用者資訊中...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 shadow rounded space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">結帳資訊</h2>

      <div>
        <label htmlFor="receiverName" className="block font-medium mb-1">
          收件人姓名：
        </label>
        <input
          id="receiverName"
          type="text"
          name="receiverName"
          value={form.receiverName}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="請輸入收件人姓名"
        />
      </div>

      <div>
        <label htmlFor="receiverPhone" className="block font-medium mb-1">
          收件人電話：
        </label>
        <input
          id="receiverPhone"
          type="tel"
          name="receiverPhone"
          value={form.receiverPhone}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="請輸入收件人電話"
          pattern="^[0-9\-+\s()]{7,15}$"
          title="請輸入有效的電話號碼"
        />
      </div>

      <div>
        <label htmlFor="shippingAddress" className="block font-medium mb-1">
          配送地址：
        </label>
        <input
          id="shippingAddress"
          type="text"
          name="shippingAddress"
          value={form.shippingAddress}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="請輸入配送地址"
        />
      </div>

      <div>
        <label htmlFor="paymentMethod" className="block font-medium mb-1">
          付款方式：
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="credit_card">信用卡</option>
          <option value="atm">ATM 轉帳</option>
          <option value="cod">貨到付款</option>
        </select>
      </div>

      <div>
        <label htmlFor="shippingMethod" className="block font-medium mb-1">
          配送方式：
        </label>
        <select
          id="shippingMethod"
          name="shippingMethod"
          value={form.shippingMethod}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="home_delivery">宅配</option>
          <option value="store_pickup">超商取貨</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block font-medium mb-1">
          備註：
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="其他需求或備註（選填）"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 w-full ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white px-4 py-2 rounded transition`}
      >
        {loading ? "送出中..." : "送出訂單"}
      </button>
    </form>
  );
}
