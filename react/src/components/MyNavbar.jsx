import { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyNavbar.css';
import { Link } from 'react-router-dom';
import MySearch from './MySearch.jsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { AppContext } from '../contexts/AppContext';
import MyNavbarCategories from './MyNavbarCategories.jsx';

function MyNavbar({ onChangeContent }) {
  const API_BASE = 'http://localhost:8080/api';
  const { userData, cartItems = [], categories = [] } = useContext(AppContext); // 安全預設值
  const [showCart, setShowCart] = useState(false);

  // 顯示購物車內容
  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => {
    setTimeout(() => setShowCart(false), 200);
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
                <MyNavbarCategories categories={categories} />
              </NavDropdown>

              <Nav.Link as={Link} to={userData?.userId ? "/myrecent" : "/userlogin"}>
                最近看過
              </Nav.Link>

              {/* 購物車連結與下拉 */}
              <div
                className="cart-link-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Nav.Link className="cart-link" as={Link} to={userData?.userId ? "/mycart" : "/userlogin"}>
                  購物車
                </Nav.Link>

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
                  <Button as={Link} to={userData?.userId ? "/mycart" : "/userlogin"} variant="primary">
                    去結帳
                  </Button>
                </div>
              </div>
                  
              <Nav.Link as={Link} to={userData?.userId ? "/myfavorite" : "/userlogin"}>
                我的收藏
              </Nav.Link>
              {/* 登入後功能選單 */}
              {userData?.username && (
                <>
                  <Nav.Link as={Link} to="/notifications">通知中心</Nav.Link>
                  <NavDropdown title={userData.username} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/orders">我的訂單</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/memberInfo">我的資料</NavDropdown.Item>
                  </NavDropdown>
                </>
              )}

              {/* 未登入顯示登入/註冊 */}
              {!userData?.username && (
                <Nav.Link as={Link} to="/userlogin">登錄/註冊</Nav.Link>
              )}
            </Nav>

            <MySearch />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
