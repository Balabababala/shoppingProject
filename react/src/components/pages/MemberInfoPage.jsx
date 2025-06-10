import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MemberInfoPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [defaultReceiverName, setDefaultReceiverName] = useState("");
  const [defaultReceiverPhone, setDefaultReceiverPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const API_BASE = "http://localhost:8080/api/";

  // 載入用戶資料
  useEffect(() => {
    fetch(`${API_BASE}user/profile`, {
      credentials: "include",
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("無法取得使用者資料");
        return resp.json();
      })
      .then((data) => {
        if (data?.data) {
          setUsername(data.data.username || "");
          setEmail(data.data.email || "");
          setDefaultAddress(data.data.defaultAddress || "");
          setDefaultReceiverName(data.data.defaultReceiverName || "");
          setDefaultReceiverPhone(data.data.defaultReceiverPhone || "");
        }
      })
      .catch((error) => {
        console.error("未獲取使用者資料", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // 驗證函式
  function validate() {
    const errors = {};
    if (!defaultAddress.trim()) errors.defaultAddress = "預設地址不可空白";
    if (!defaultReceiverName.trim())
      errors.defaultReceiverName = "收件人姓名不可空白";
    if (!defaultReceiverPhone.trim())
      errors.defaultReceiverPhone = "收件人電話不可空白";

    return errors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitLoading(true);

    fetch(`${API_BASE}user/profile/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username, // 雖然只讀，後端可能需要它
        email,    // 雖然只讀，後端可能需要它
        defaultAddress,
        defaultReceiverName,
        defaultReceiverPhone,
      }),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("更新失敗");
        return resp.json();
      })
      .then((data) => {
        setSubmitSuccess("更新成功！");
      })
      .catch((error) => {
        setSubmitError(error.message || "更新發生錯誤");
      })
      .finally(() => setSubmitLoading(false));
  };

  if (loading) return <p className="text-center mt-5">載入中...</p>;
  if (error) return <p className="text-danger text-center mt-5">錯誤：{error}</p>;

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4 text-center">會員資料修改</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* 使用者名稱 */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            使用者名稱
          </label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            readOnly
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            帳號（email）
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            readOnly
          />
        </div>

        {/* 預設地址 */}
        <div className="mb-3">
          <label htmlFor="defaultAddress" className="form-label">
            預設地址
          </label>
          <input
            id="defaultAddress"
            type="text"
            className={`form-control ${
              validationErrors.defaultAddress ? "is-invalid" : ""
            }`}
            value={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.value)}
            placeholder="請輸入預設地址"
            required
          />
          <div className="invalid-feedback">{validationErrors.defaultAddress}</div>
        </div>

        {/* 預設收件人姓名 */}
        <div className="mb-3">
          <label htmlFor="defaultReceiverName" className="form-label">
            預設收件人姓名
          </label>
          <input
            id="defaultReceiverName"
            type="text"
            className={`form-control ${
              validationErrors.defaultReceiverName ? "is-invalid" : ""
            }`}
            value={defaultReceiverName}
            onChange={(e) => setDefaultReceiverName(e.target.value)}
            placeholder="請輸入收件人姓名"
            required
          />
          <div className="invalid-feedback">{validationErrors.defaultReceiverName}</div>
        </div>

        {/* 預設收件人電話 */}
        <div className="mb-3">
          <label htmlFor="defaultReceiverPhone" className="form-label">
            預設收件人電話
          </label>
          <input
            id="defaultReceiverPhone"
            type="text"
            className={`form-control ${
              validationErrors.defaultReceiverPhone ? "is-invalid" : ""
            }`}
            value={defaultReceiverPhone}
            onChange={(e) => setDefaultReceiverPhone(e.target.value)}
            placeholder="請輸入收件人電話"
            required
          />
          <div className="invalid-feedback">{validationErrors.defaultReceiverPhone}</div>
        </div>

        {/* 成功 / 錯誤提示 */}
        {submitError && (
          <div className="alert alert-danger" role="alert">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="alert alert-success" role="alert">
            {submitSuccess}
          </div>
        )}

        {/* 提交按鈕 */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={submitLoading}
          aria-live="polite"
        >
          {submitLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              更新中...
            </>
          ) : (
            "更新資訊"
          )}
        </button>
      </form>
    </div>
  );
}

export default MemberInfoPage;
