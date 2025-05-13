import React, { useState } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap'; // 使用 react-bootstrap 來設計表單
import axios from 'axios';
import '../../css/UserLoginPage.css'; // 引入自定義的 CSS 樣式

function LoginPage() {
  // 設置狀態來存儲用戶選擇的角色（買家或賣家）
  const [role, setRole] = useState(null);

  // 設置是否為登入模式，默認為登入模式
  const [isLogin, setIsLogin] = useState(true);

  // 用戶輸入的驗證碼
  const [captchaCode, setCaptchaCode] = useState('');

  // 驗證碼圖片 URL
  const [captchaImage, setCaptchaImage] = useState(null);

  // 表單提交處理函式
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      role: role, // 角色（買家或賣家）
      username: event.target.username.value, // 用戶名
      password: event.target.password.value, // 密碼
      captchaCode: captchaCode, // 驗證碼
    };
    try {
      // 根據 isLogin 的值選擇不同的 API 請求
      const url = isLogin
        ? 'http://localhost:8080/api/login' // 登入 API
        : 'http://localhost:8080/api/register'; // 註冊 API

      const response = await axios.post(url, data, { withCredentials: true }); // 發送 POST 請求

      // 根據後端返回的結果進行處理
      if (response.data.success) {
        alert(isLogin ? '登入成功' : '註冊成功');
      } else {
        alert(isLogin ? '登入失敗：' + response.data.message : '註冊失敗：' + response.data.message);
      }
    } catch (error) {
      console.error('表單提交時出現錯誤', error);
      alert('提交失敗，請稍後再試');
    }
  };

  // 處理角色選擇變更
  const handleRoleChange = (event) => {
    setRole(event.target.value); // 設置用戶選擇的角色
  };

  // 切換登入/註冊模式
  const toggleForm = () => {
    setIsLogin(!isLogin); // 改變登錄模式或註冊模式
  };

  // 加載驗證碼圖片
  const loadCaptcha = () => {
    setCaptchaImage(`http://localhost:8080/api/auth-code?${new Date().getTime()}`); // 使用正確的 URL 加載驗證碼
  };

  // 在頁面載入時加載驗證碼圖片
  React.useEffect(() => {
    loadCaptcha();
  }, []);

  return (
<<<<<<< HEAD
   
    <Container className="py-5" style={{
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '1rem',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
  }}>
      <h2 className="text-center">{isLogin ? '登錄' : '註冊'}</h2>
      <Form onSubmit={handleSubmit}>
        {/* 角色選擇 */}
        <Form.Group controlId="roleSelect">
          <Form.Label>選擇身份</Form.Label>
          <Form.Check
            type="radio"
            label="買家"
            value="buyer"
            checked={role === 'buyer'}
            onChange={handleRoleChange}
          />
          <Form.Check
            type="radio"
            label="賣家"
            value="seller"
            checked={role === 'seller'}
            onChange={handleRoleChange}
          />
        </Form.Group>
=======
    <Container className="py-5 d-flex justify-content-center login">
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">{isLogin ? '登錄' : '註冊'}</h2>
        <Form onSubmit={handleSubmit}>
          {/* 角色選擇 */}
          <Form.Group controlId="roleSelect">
            <Form.Label>選擇身份</Form.Label>
            <Row>
              <Col xs={6}>
                <Form.Check
                  type="radio"
                  id="roleSelectBuyer"
                  label="買家"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={handleRoleChange}
                  size="sm"
                />
              </Col>
              <Col xs={6}>
                <Form.Check
                  type="radio"
                  id="roleSelectSeller"
                  label="賣家"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={handleRoleChange}
                  size="sm"
                />
              </Col>
            </Row>
          </Form.Group>
>>>>>>> branch 'main' of https://github.com/Balabababala/shoppingProject

          {/* 用戶名 */}
          <Form.Group controlId="username">
            <Form.Label>用戶名</Form.Label>
            <Form.Control
              type="text"
              placeholder="請輸入用戶名"
              required
              size="lg"
              style={{ borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
            />
          </Form.Group>

          {/* 密碼 */}
          <Form.Group controlId="password">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="請輸入密碼"
              required
              size="lg"
              style={{ borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
            />
          </Form.Group>

          {/* 顯示驗證碼圖片 */}
          <Form.Group controlId="captcha">
            <Form.Label>驗證碼</Form.Label>
            <div>
              <img src={captchaImage} alt="Captcha" style={{ width: '100px', height: '40px', borderRadius: '0.5rem' }} />
            </div>
            <Form.Control
              type="text"
              placeholder="請輸入驗證碼"
              value={captchaCode}
              onChange={(e) => setCaptchaCode(e.target.value)}
              required
              size="lg"
              style={{ borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
            />
          </Form.Group>

          {/* 登錄或註冊的提交按鈕 */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            size="lg"
            style={{
              borderRadius: '0.5rem',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              padding: '10px 0',
            }}
          >
            {isLogin ? '登錄' : '註冊'}
          </Button>

          {/* 切換到註冊/登錄的鏈接 */}
          <Row className="mt-3">
            <Col className="text-center">
              <Button variant="link" onClick={toggleForm} size="sm">
                {isLogin ? '註冊新帳號' : '已有帳號，點擊登錄'}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;
