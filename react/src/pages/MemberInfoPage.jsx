import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts/AppContext";
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

  const {
    API_BASE,
    userData,
    fetchWithAuthCheck,
    addToastMessage,
  } = useContext(AppContext);

  useEffect(() => {
    if (!userData) {
      setError("尚未登入，請重新登入");
      setLoading(false);
      return;
    }

    fetchWithAuthCheck(`${API_BASE}/user/profile`)
      .then((res) => {
        if (!res || res.authError) {
          throw new Error("無法取得使用者資料");
        }
        if (res?.data) {
          const data = res.data;
          setUsername(data.username || "");
          setEmail(data.email || "");
          setDefaultAddress(data.defaultAddress || "");
          setDefaultReceiverName(data.defaultReceiverName || "");
          setDefaultReceiverPhone(data.defaultReceiverPhone || "");
        }
      })
      .catch((err) => {
        console.error("取得使用者資料失敗", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [API_BASE, fetchWithAuthCheck, userData]);

  function validate() {
    const errors = {};
    if (!defaultAddress.trim()) errors.defaultAddress = "預設地址不可空白";
    if (!defaultReceiverName.trim()) errors.defaultReceiverName = "收件人姓名不可空白";
    if (!defaultReceiverPhone.trim()) errors.defaultReceiverPhone = "收件人電話不可空白";
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitLoading(true);

    try {
      const result = await fetchWithAuthCheck(`${API_BASE}/user/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          defaultAddress,
          defaultReceiverName,
          defaultReceiverPhone,
        }),
      });

      if (!result || result.authError) throw new Error("更新失敗");

      setSubmitSuccess("更新成功！");
      addToastMessage("會員資訊已更新");
    } catch (err) {
      setSubmitError(err.message || "更新發生錯誤");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">載入中...</p>;
  if (error) return <p className="text-danger text-center mt-5">錯誤：{error}</p>;

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4 text-center">會員資料修改</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">使用者名稱</label>
          <input id="username" type="text" className="form-control" value={username} readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">帳號（email）</label>
          <input id="email" type="email" className="form-control" value={email} readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="defaultAddress" className="form-label">預設地址</label>
          <input
            id="defaultAddress"
            type="text"
            className={`form-control ${validationErrors.defaultAddress ? "is-invalid" : ""}`}
            value={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.value)}
            placeholder="請輸入預設地址"
          />
          <div className="invalid-feedback">{validationErrors.defaultAddress}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="defaultReceiverName" className="form-label">預設收件人姓名</label>
          <input
            id="defaultReceiverName"
            type="text"
            className={`form-control ${validationErrors.defaultReceiverName ? "is-invalid" : ""}`}
            value={defaultReceiverName}
            onChange={(e) => setDefaultReceiverName(e.target.value)}
            placeholder="請輸入收件人姓名"
          />
          <div className="invalid-feedback">{validationErrors.defaultReceiverName}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="defaultReceiverPhone" className="form-label">預設收件人電話</label>
          <input
            id="defaultReceiverPhone"
            type="text"
            className={`form-control ${validationErrors.defaultReceiverPhone ? "is-invalid" : ""}`}
            value={defaultReceiverPhone}
            onChange={(e) => setDefaultReceiverPhone(e.target.value)}
            placeholder="請輸入收件人電話"
          />
          <div className="invalid-feedback">{validationErrors.defaultReceiverPhone}</div>
        </div>

        {submitError && <div className="alert alert-danger">{submitError}</div>}
        {submitSuccess && <div className="alert alert-success">{submitSuccess}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={submitLoading}>
          {submitLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
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
