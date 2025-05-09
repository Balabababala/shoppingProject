import { useState } from 'react';  // 引入 useState
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyNavbar.css';  // 它專屬的css
import { Link } from 'react-router-dom'; // 引入 Link
import ProductCard from './ProductCard'; // 產品卡片 測試用 暫時 應該要在推薦
import MySearch from './MySearch.jsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function MyNavbar({ onChangeContent }) {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([ // 假設這是你的購物車內容
    {
      id: 1,
      name: '測試商品1',
      price: 199,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: '測試商品2',
      price: 299,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]);

  // 顯示購物車內容
  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => {
    setTimeout(() => setShowCart(false), 200);  // 延遲隱藏，給使用者足夠時間去點擊
  };

  const product = {  // 產品卡片 測試用 暫時
    id: 1,
    name: '測試商品',
    price: 199,
    imageUrl: 'https://via.placeholder.com/150',
    description: '這是一個假商品，用來測試卡片功能。',
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" className="mynavbar">
        <Container>
          <Navbar.Brand as={Link} to="/">左上角的</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav>
              <NavDropdown title="商品分類" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/member">測試商品卡片</NavDropdown.Item>   
                <NavDropdown.Item href="#action/3.2">之後串後端資料</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">之後串後端資料</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/recent">最近看過</Nav.Link>
              <Nav.Link
                as={Link}
                to="/cart"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="cart-link"
              >
                購物車
                {/* 顯示購物車內容 */}
                <div className={`cart-dropdown ${showCart ? 'show' : ''}`}>
                  {cartItems.length === 0 ? (
                    <div>購物車是空的</div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: 50, height: 50 }}
                        />
                        <div>{item.name}</div>
                        <div>${item.price}</div>
                      </div>
                    ))
                  )}
                  {/* 顯示結帳按鈕 */}
                  <button className="btn btn-primary">去結帳</button>
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/member">會員中心</Nav.Link>
              <Nav.Link as={Link} to="/notificationsPage">通知中心</Nav.Link>
              <Nav.Link as={Link} to="/userlogin">登錄/註冊</Nav.Link>
            </Nav>
            <MySearch />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
