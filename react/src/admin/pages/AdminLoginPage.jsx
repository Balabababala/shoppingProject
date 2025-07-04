import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminAppContext } from '../contexts/AdminAppContext';

function AdminLoginPage() {
  const { API_BASE, setAdminUserData, addToastMessage, fetchWithAuthCheck } = useContext(AdminAppContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState(null);
  const [captchaJwtToken, setCaptchaJwtToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth-code`);
      const result = await res.json();
      if (res.ok && result.data) {
        setCaptchaImage(`data:image/png;base64,${result.data.image}`);
        setCaptchaJwtToken(result.data.token);
        setCaptchaCode('');
      } else {
        addToastMessage('無法載入驗證碼，請稍後再試');
      }
    } catch (error) {
      console.error('載入驗證碼錯誤:', error);
      addToastMessage('載入驗證碼失敗，請稍後再試');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
          captchaCode,
          captchaJwtToken,  // 一定要帶上這個，後端才知道驗證碼的 JWT
        }),
      });

      const result = await res.json();

      if (res.ok && result.message === '登入成功' && typeof result.data === 'string') {
        const token = result.data;
        localStorage.setItem('adminToken', token);

        const meResult = await fetchWithAuthCheck(`${API_BASE}/admin/me`);
        if (!meResult || meResult.authError) {
          addToastMessage('無法取得使用者資訊，請重新登入');
          setLoading(false);
          return;
        }

        if (meResult.message === '取得後台使用者資料成功' && meResult.data) {
          localStorage.setItem('adminUserData', JSON.stringify(meResult.data));
          setAdminUserData({ token, user: meResult.data });
          addToastMessage('登入成功');
          navigate('/admin/dashboard');
        } else {
          addToastMessage('無法取得使用者資訊，請重新登入');
        }
      } else {
        addToastMessage(`登入失敗：${result.message || '請確認資料正確'}`);
        loadCaptcha();
      }
    } catch (error) {
      console.error('登入請求錯誤：', error);
      addToastMessage('登入時發生錯誤，請稍後再試');
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center py-5">
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">後台登入</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>用戶名</Form.Label>
            <Form.Control
              type="text"
              placeholder="請輸入用戶名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="captcha" className="mb-3">
            <Form.Label>驗證碼</Form.Label>
            <div className="mb-2">
              {captchaImage ? (
                <img
                  src={captchaImage}
                  alt="驗證碼"
                  style={{ width: '100px', height: '40px', cursor: 'pointer' }}
                  onClick={loadCaptcha}
                  title="點擊重新載入驗證碼"
                />
              ) : (
                <span>載入中...</span>
              )}
            </div>
            <Form.Control
              type="text"
              placeholder="請輸入驗證碼"
              value={captchaCode}
              onChange={(e) => setCaptchaCode(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mt-3" variant="primary" disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AdminLoginPage;
