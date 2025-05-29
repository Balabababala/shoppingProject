import React, { useState ,useContext} from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap'; // 使用 react-bootstrap 來設計表單
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext'; // 這是 useEffect 集合
import '../../css/UserLoginPage.css'; // 引入自定義的 CSS 樣式

function LoginPage() {

  const API_BASE= 'http://localhost:8080';

  const {setUserData} = useContext(AppContext);
  // 設置狀態來存儲用戶選擇的角色（買家或賣家）
  const [role, setRole] = useState(null);

  // 設置是否為登入模式，默認為登入模式
  const [isLogin, setIsLogin] = useState(true);

  // 用戶輸入的驗證碼
  const [captchaCode, setCaptchaCode] = useState('');

  // 驗證碼圖片 URL
  const [captchaImage, setCaptchaImage] = useState(null);

  const navigate = useNavigate();

  // 表單提交處理函式
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value, // 用戶名
      password: e.target.password.value, // 密碼
      captchaCode: captchaCode, // 驗證碼
    };
    try {
      // 根據 isLogin 的值選擇不同的 API 請求
      const url = isLogin
        ? `${API_BASE}/api/login` // 登入 API
        : `${API_BASE}/api/register`; // 註冊 API
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // 
        body: JSON.stringify(data)
      });
    const result = await response.json();

      // 根據後端返回的結果進行處理
      if (result.message=="登入成功" || result.message=="註冊成功") {
        alert(isLogin ? '登入成功' : '註冊成功');
        setUserData(result.data);
        navigate('/');
      } else {
        alert(isLogin ? '登入失敗：' + response.data.message : '註冊失敗：' + response.data.message);
      }
    } catch (error) {
      console.error('表單提交時出現錯誤', error);
      alert('提交失敗，請稍後再試');
    }
  };

  // 處理角色選擇變更

  // 切換登入/註冊模式
  const toggleForm = () => {
    setIsLogin(!isLogin); // 改變登錄模式或註冊模式
  };

  // 加載驗證碼圖片
  const loadCaptcha = () => {
    setCaptchaImage(`${API_BASE}/api/auth-code?${new Date().getTime()}`); // 使用正確的 URL 加載驗證碼
  };

  // 在頁面載入時加載驗證碼圖片
  React.useEffect(() => {
    loadCaptcha();
  }, []);

  return (
    <Container className="py-5 d-flex justify-content-center login">
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">{isLogin ? '登錄' : '註冊'}</h2>
        <Form onSubmit={handleSubmit}>

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
