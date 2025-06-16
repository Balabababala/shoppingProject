  // admin/LoginPage.jsx
  import React, { useState, useContext, useEffect } from 'react';
  import { Form, Button, Col, Row, Container } from 'react-bootstrap';
  import { useNavigate } from 'react-router-dom';
  import { AdminAppContext } from '../contexts/AdminAppContext';

  function AdminLoginPage() {
    const {API_BASE, setAdminUserData, addToastMessage } = useContext(AdminAppContext);
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
        const url = `${API_BASE}/admin/login`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        const result = await response.json();
       

        if (result.message === '登入成功') {
          addToastMessage('登入成功');
          setAdminUserData(result.data);
          
          navigate('/admin/dashboard');  // 後台首頁路由
        } else {
          addToastMessage('登入失敗：' + result.message);
          // 驗證碼失敗或其他錯誤時可以刷新驗證碼
          loadCaptcha();
        }
      } catch (error) {
        console.error('表單提交時出現錯誤', error);
        addToastMessage('提交失敗，請稍後再試');
        loadCaptcha();
      }
    };

    const loadCaptcha = () => {
      setCaptchaImage(`${API_BASE}/auth-code?${new Date().getTime()}`);
    };

    useEffect(() => {
      loadCaptcha();
    }, []);

    return (
    <Container className="d-flex justify-content-center ">
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4 ">後台登入</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>用戶名</Form.Label>
              <Form.Control type="text" placeholder="請輸入用戶名" required />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>密碼</Form.Label>
              <Form.Control type="password" placeholder="請輸入密碼" required />
            </Form.Group>

            <Form.Group controlId="captcha" className="mb-3">
              <Form.Label>驗證碼</Form.Label>
              <div>
                <img
                  src={captchaImage}
                  alt="驗證碼"
                  style={{ width: '100px', height: '40px', cursor: 'pointer' }}
                  onClick={loadCaptcha} // 點圖片重新載入
                  title="點擊重新載入驗證碼"
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
          </Form>
        </div>
      </Container>
    );
  }

  export default AdminLoginPage;
