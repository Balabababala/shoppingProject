import { useState, useContext } from 'react';
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
  const {
    BASE_URL,
    userData,
    cartItems = [],
    categories = [],
    setUserData,
    addToastMessage,
    API_BASE,
  } = useContext(AppContext);

  const [showCart, setShowCart] = useState(false);

  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => {
    setTimeout(() => setShowCart(false), 200);
  };

  // 改成純前端登出
  const logout = () => {
    setUserData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    addToastMessage('已成功登出');
    window.location.href = '/';
  };

  // 先判斷 userData 是否存在，再取 user
  const user = userData?.user;

  // 角色判斷
  const isBuyer = user?.role === 'ROLE_BUYER';
  const isSeller = user?.role === 'ROLE_SELLER';

  return (
    <>
      <Navbar expand="lg" fixed="top" className="mynavbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            ShopVerse
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav>
              <NavDropdown title="商品分類" id="basic-nav-dropdown">
                <MyNavbarCategories categories={categories} />
              </NavDropdown>

              {user?.username && (
                <Nav.Link as={Link} to="/myrecent">
                  最近看過
                </Nav.Link>
              )}

              {/* 購物車連結與下拉，只有買家看到 */}
              {isBuyer && (
                <div
                  className="cart-link-wrapper"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Nav.Link
                    className="cart-link"
                    as={Link}
                    to={user?.userId ? '/mycart' : '/userlogin'}
                  >
                    購物車
                  </Nav.Link>

                  <div className={`cart-dropdown ${showCart ? 'show' : ''}`}>
                    {cartItems.length === 0 ? (
                      <div>購物車是空的</div>
                    ) : (
                      <>
                        {cartItems.slice(0, 4).map((item) => (
                          <div key={item.id} className="cart-item">
                            <img
                              src={`${BASE_URL}${item.imageUrl}`}
                              alt={item.name}
                              style={{ width: 50, height: 50 }}
                            />
                            <div>{item.name}</div>
                            <div>${item.price}</div>
                          </div>
                        ))}
                        {cartItems.length > 4 && (
                          <div className="more-items">
                            還有 {cartItems.length - 4} 項商品...
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 登入後功能選單 */}
              {user?.username ? (
                <NavDropdown title={user.username} id="basic-nav-dropdown">
                  {isBuyer ? (
                    <>
                      <NavDropdown.Item as={Link} to="/notifications">
                        通知中心
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/myfavorite">
                        我的收藏
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/orders">
                        我的訂單
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/memberInfo">
                        我的資料
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={logout}>登出</NavDropdown.Item>
                    </>
                  ) : isSeller ? (
                    <>
                      <NavDropdown.Item as={Link} to="/notifications">
                        通知中心
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/seller/products">
                        我的商品
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/seller/orders">
                        我的訂單
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/memberInfo">
                        我的資料
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={logout}>登出</NavDropdown.Item>
                    </>
                  ) : null}
                </NavDropdown>
              ) : (
                // 未登入顯示登入/註冊
                <Nav.Link as={Link} to="/userlogin">
                  登錄/註冊
                </Nav.Link>
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
