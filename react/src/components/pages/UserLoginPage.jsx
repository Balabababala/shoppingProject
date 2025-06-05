import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import '../../css/UserLoginPage.css';

function LoginPage() {
  const API_BASE = 'http://localhost:8080';
  const { setUserData } = useContext(AppContext);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      captchaCode,
    };

    try {
      const url = `${API_BASE}/api/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message === '登入成功') {
        alert('登入成功');
        setUserData(result.data);
        navigate('/');
      } else {
        alert('登入失敗：' + result.message);
      }
    } catch (error) {
      console.error('表單提交時出現錯誤', error);
      alert('提交失敗，請稍後再試');
    }
  };

  const loadCaptcha = () => {
    setCaptchaImage(`${API_BASE}/api/auth-code?${new Date().getTime()}`);
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
            <div>
              <img src={captchaImage} alt="Captcha" style={{ width: '100px', height: '40px' }} />
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
