import React, { useEffect, useState } from 'react';
import '../../css/MemberInfo.css';

// DTO MemberInfoDTO username: String
//                   fullName: String
//                   email:    String
//                   phone:    String
//                   address:  String

function MemberInfo() {
  const [form, setForm] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setForm({
        username: 'john123',
        fullName: '張允豪',
        email: 'john@example.com',
        phone: '0912-345-678',
        address: '台中市西屯區中港路123號',
      });
    }, 1000);
  }, []);

  if (!form.username) return <div>載入中...</div>;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('送出資料：' + JSON.stringify(form));
    // 這裡可呼叫 API
  };


  const getUserData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/memberinfo`, { credentials: 'include' });
      if (!res.ok) throw new Error('伺服器錯誤');
      const data = await res.json();
      setForm(data.data); // 根據實際回傳調整
     } catch (err) {
      console.error('取得使用者資料失敗:', err.message);
      alert('取得使用者資料失敗: ' + err.message);
    }
  };//要用的話 useEffect 裡面替換成 getUserData()
  

  return (
    <div>
      <h1>會員個人資料</h1>
        <form onSubmit={handleSubmit} key={form.username}>
          <div className="form-row">
            <label className="form-label">帳號:</label>
            <input
              name="username"
              value={form.username}
              readOnly
            />
          </div>

          <div className="form-row">
            <label className="form-label">姓名:</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label className="form-label">電話:</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label className="form-label">地址:</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <button type="submit">編輯資料</button>
        </form>
    </div>
  );
}

export default MemberInfo;
