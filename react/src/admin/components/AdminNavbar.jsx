import { useState,useContext} from 'react';
import { Link } from 'react-router-dom';
import { AdminAppContext } from '../contexts/AdminAppContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';

function AdminNavbar() {
  const [showCart, setShowCart] = useState(false);

  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => setTimeout(() => setShowCart(false), 200);
 const { API_BASE, setAdminUserData,addToastMessage } = useContext(AdminAppContext);

   const logout = () => {
    setAdminUserData(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUserData');
    window.location.href = '/admin'; // 導回登入頁
  };

  return (
    <Navbar expand="lg" fixed="top" className="mynavbar">
      <Container>
        <Navbar.Brand as={Link} to="/admin/dashboard">網站名稱</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav>

            <NavDropdown title="商品管理" id="product-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/products">商品列表</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/categories">商品分類管理</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/reviews">評論管理</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="訂單管理" id="oder-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/order">訂單紀錄</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="用戶管理" id="user-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/users">會員列表</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="推薦系統管理" id="recommend-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/recommend/rules">設定推薦規則</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/recommend/content">編輯推薦內容</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="搜尋與瀏覽紀錄" id="history-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/history/search">搜尋紀錄查詢</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/history/browse">最近瀏覽商品紀錄</NavDropdown.Item>
            </NavDropdown>

             <NavDropdown title="通知" id="notication-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/notification">所有通知</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/notification/new">新增通知</NavDropdown.Item>
            </NavDropdown>


            <NavDropdown title="帳號管理" id="account-nav-dropdown">
              <NavDropdown.Item onClick={logout}>登出</NavDropdown.Item>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
