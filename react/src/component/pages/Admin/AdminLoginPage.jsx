import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://your-api-url/login', {
        email,
        password,
        role: 'admin', // 設定角色為「員工」
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin-dashboard'); // 重定向到員工主頁
      } else {
        setError('帳號或密碼錯誤');
      }
    } catch (err) {
      console.error(err);
      setError('登錄失敗，請重試');
    }
  };

  return (
    <div>
      <h2>員工登入</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">登入</button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
