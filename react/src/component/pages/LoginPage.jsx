import React, { useState } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap';  // 使用 react-bootstrap 來設計表單

function LoginPage() {
  const [role, setRole] = useState(null); // 狀態來存儲選擇的身份（買家或賣家）
  const [isLogin, setIsLogin] = useState(true); // 是否為登錄模式

  const handleRoleChange = (event) => {
    setRole(event.target.value); // 設置用戶選擇的角色
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // 切換登錄/註冊模式
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 提交邏輯（這部分可根據需求進行後端處理）
    alert(`Submitted as ${role} in ${isLogin ? 'Login' : 'Register'} mode.`);
  };

  return (
    <Container className="py-5">
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

        {/* 用戶名 */}
        <Form.Group controlId="username">
          <Form.Label>用戶名</Form.Label>
          <Form.Control type="text" placeholder="請輸入用戶名" required />
        </Form.Group>

        {/* 密碼 */}
        <Form.Group controlId="password">
          <Form.Label>密碼</Form.Label>
          <Form.Control type="password" placeholder="請輸入密碼" required />
        </Form.Group>

        {/* 登錄或註冊的提交按鈕 */}
        <Button variant="primary" type="submit" block>
          {isLogin ? '登錄' : '註冊'}
        </Button>

        <Row className="mt-3">
          <Col className="text-center">
            <Button variant="link" onClick={toggleForm}>
              {isLogin ? '註冊新帳號' : '已有帳號，點擊登錄'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginPage;
