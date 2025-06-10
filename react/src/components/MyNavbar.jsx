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
  const { userData, cartItems = [], categories = [],setUserData,addToastMessage} = useContext(AppContext); // 安全預設值
  const [showCart, setShowCart] = useState(false);

  // 顯示購物車內容
  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => {
    setTimeout(() => setShowCart(false), 200);
  };

  //登出 因為只在這登出


  const logout = () =>{
    fetch(`${API_BASE}/logout`,{
      method: 'POST',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-cache' },
      
    })
    .then(response => {
      if (response.ok) {
        setUserData(null); // 清空前端 userData
        window.location.href = '/';
      } else {
        addToastMessage('登出失敗');
      }
    })
    .catch(error => {
      addToastMessage('登出時發生錯誤', error);
    });
  }

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
              {userData?.username &&(                                               //可能會改讓非使用者能用
                <Nav.Link as={Link} to= "/myrecent">
                最近看過
                </Nav.Link>
              )}
                                                                                    {/*可能會改讓非使用者能用*/}
              {/* 購物車連結與下拉 */}                                               
              {userData?.roleId === 1 && (
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
                      <>
                        {cartItems.slice(0, 4).map((item) => (
                          <div key={item.id} className="cart-item">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={{ width: 50, height: 50 }}
                            />
                            <div>{item.name}</div>
                            <div>${item.price}</div>
                          </div>
                        ))}
                        {cartItems.length > 4 && (
                          <div className="more-items">還有 {cartItems.length - 4} 項商品...</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}   
                  
              {/* 登入後功能選單 */}
              {userData?.username && (
                <NavDropdown title={userData.username} id="basic-nav-dropdown">
                  {userData?.roleId === 1 ? (
                    <>
                      {/* 買家登入 */}
                      <NavDropdown.Item as={Link} to="/notifications">通知中心</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/myfavorite">我的收藏</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/orders">我的訂單</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/memberInfo">我的資料</NavDropdown.Item>
                      <NavDropdown.Item onClick={logout}>登出</NavDropdown.Item>
                    </>
                  ) : userData?.roleId === 2 ? (
                    <>
                      {/* 賣家登入 */}
                      <NavDropdown.Item as={Link} to="/notifications">通知中心</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/seller/products">我的商品</NavDropdown.Item> {/* 記得補 */}
                      <NavDropdown.Item as={Link} to="/seller/orders">我的訂單</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/memberInfo">我的資料</NavDropdown.Item>
                      <NavDropdown.Item onClick={logout}>登出</NavDropdown.Item>
                    </>
                  ) : (
                    // 如果有其他角色可以在這裡補
                    null
                  )}
                </NavDropdown>
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
