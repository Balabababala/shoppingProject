import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import '../css/UserLoginPage.css';

function LoginPage() {
  const { setUserData, addToastMessage, API_BASE } = useContext(AppContext);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState(null);
  const navigate = useNavigate();

  const loadCaptcha = () => {
    setCaptchaImage(`${API_BASE}/auth-code?${Date.now()}`);
    setCaptchaCode(''); // 清空驗證碼輸入
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      captchaCode,
    };

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();
      console.log('🔑 登入回應:', result);

      if (result.message === '登入成功') {
        const token = result.data?.trim(); // 去除可能的空白
        if (!token) {
          addToastMessage('登入失敗：無效的 token');
          loadCaptcha();
          return;
        }
        console.log('✅ 成功登入，JWT token:', token);
        localStorage.setItem('token', token);

        // 取得使用者資訊
        console.log('📤 發送 Authorization 頭:', `Bearer ${token}`);
        const userResp = await fetch(`${API_BASE}/user/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('📡 /user/me response status:', userResp.status);

        if (!userResp.ok) {
          const errData = await userResp.json();
          console.error('❌ 取得使用者資料錯誤:', errData);
          addToastMessage(`登入成功但取得使用者資料失敗: ${errData.message || '未知錯誤'}`);
          loadCaptcha();
          return;
        }

        const userResult = await userResp.json();
        console.log('👤 使用者資料:', userResult);

        if (userResult?.data) {
          setUserData({
            token,
            user: userResult.data,
          });
          addToastMessage('登入成功');
          navigate('/');
        } else {
          console.warn('⚠️ /user/me 沒有包含 data 欄位:', userResult);
          addToastMessage('登入成功但使用者資料格式錯誤');
          loadCaptcha();
        }
      } else {
        addToastMessage('登入失敗：' + result.message);
        loadCaptcha();
      }
    } catch (error) {
      console.error('⚠️ 登入時發生錯誤:', error);
      addToastMessage('登入失敗，請稍後再試');
      loadCaptcha();
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  return (
    <Container className="py-5 d-flex justify-content-center login">
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">登入</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>用戶名</Form.Label>
            <Form.Control type="text" placeholder="請輸入用戶名" required />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>密碼</Form.Label>
            <Form.Control type="password" placeholder="請輸入密碼" required />
          </Form.Group>

          <Form.Group controlId="captcha">
            <Form.Label>驗證碼</Form.Label>
            <div className="mb-2">
              <img
                src={captchaImage}
                alt="驗證碼"
                style={{ width: '100px', height: '40px', cursor: 'pointer' }}
                onClick={loadCaptcha}
                title="點擊刷新驗證碼"
              />
            </div>
            <Form.Control
              type="text"
              placeholder="請輸入驗證碼"
              value={captchaCode}
              onChange={(e) => setCaptchaCode(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mt-3" variant="primary">
            登入
          </Button>

          <Row className="mt-3">
            <Col className="text-center">
              <Button variant="link" onClick={() => navigate('/register')}>
                註冊新帳號
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;