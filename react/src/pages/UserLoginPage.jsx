import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import '../css/UserLoginPage.css';

function LoginPage() {
  const { setUserData, addToastMessage, API_BASE } = useContext(AppContext);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();

  // 取得驗證碼圖片跟 JWT token
  const loadCaptcha = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth-code`);
      const result = await res.json();
      if (result?.data?.image && result?.data?.token) {
        setCaptchaImage(`data:image/png;base64,${result.data.image}`);
        setCaptchaToken(result.data.token);
        setCaptchaCode('');
      } else {
        addToastMessage('載入驗證碼失敗');
      }
    } catch (error) {
      addToastMessage('載入驗證碼錯誤');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      addToastMessage('驗證碼尚未載入，請稍後再試');
      return;
    }

    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      captchaCode,
      captchaToken,  // 一定要帶給後端解析
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
        const token = result.data?.trim(); // 去除可能空白
        if (!token) {
          addToastMessage('登入失敗：無效的 token');
          await loadCaptcha();
          return;
        }

        localStorage.setItem('token', token);

        // 取得使用者資訊
        const userResp = await fetch(`${API_BASE}/user/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResp.ok) {
          const errData = await userResp.json();
          addToastMessage(`登入成功但取得使用者資料失敗: ${errData.message || '未知錯誤'}`);
          await loadCaptcha();
          return;
        }

        const userResult = await userResp.json();

        if (userResult?.data) {
          setUserData({
            token,
            user: userResult.data,
          });
          addToastMessage('登入成功');
          navigate('/');
        } else {
          addToastMessage('登入成功但使用者資料格式錯誤');
          await loadCaptcha();
        }
      } else {
        addToastMessage('登入失敗：' + result.message);
        await loadCaptcha();
      }
    } catch (error) {
      addToastMessage('登入失敗，請稍後再試');
      await loadCaptcha();
      console.error(error);
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

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>密碼</Form.Label>
            <Form.Control type="password" placeholder="請輸入密碼" required />
          </Form.Group>

          <Form.Group controlId="captcha" className="mt-3">
            <Form.Label>驗證碼</Form.Label>
            <div className="mb-2">
              {captchaImage ? (
                <img
                  src={captchaImage}
                  alt="驗證碼"
                  style={{ width: '100px', height: '40px', cursor: 'pointer' }}
                  onClick={loadCaptcha}
                  title="點擊刷新驗證碼"
                />
              ) : (
                <div>載入中...</div>
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

          <Button type="submit" className="w-100 mt-4" variant="primary">
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
