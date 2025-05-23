import { useState,useContext  } from 'react';  // 
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyNavbar.css';  // 它專屬的css
import { Link } from 'react-router-dom'; // 引入 Link
import MySearch from './MySearch.jsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';  // 正確導入 NavDropdown
import { AppContext } from '../contexts/AppContext'; // 這是 useEffect 集合
import MyNavbarCategories from './MyNavbarCategories.jsx';

function MyNavbar({ onChangeContent }) {
  const API_BASE='http://localhost:8080/api';
 
  const { userData, cartItems, categories } = useContext(AppContext);
  const [showCart, setShowCart] = useState(false);
  
  // 顯示購物車內容
  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => {
    setTimeout(() => setShowCart(false),200);  // 延遲隱藏，給使用者足夠時間去點擊
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" className="mynavbar">
        <Container>
          <Navbar.Brand as={Link} to="/">左上角的</Navbar.Brand>                      {/*商標 回首頁*/}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav>
              <NavDropdown title="商品分類" id="basic-nav-dropdown">
                <MyNavbarCategories categories={categories} />
              </NavDropdown>
              <Nav.Link as={Link} to={userData===null?"/userlogin":"/recent"}>最近看過</Nav.Link>
              <div
              className="cart-link-wrapper"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
                <Nav.Link className="cart-link" as={Link} to={userData===null?"/userlogin":"/cart"}>購物車</Nav.Link>{/*未登入 導向登入頁*/} 

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
                  <Button as={Link} to={userData===null?"/userlogin":"/cart"} variant="primary">
                    去結帳
                  </Button>
                </div>
              </div>  
              {/*如果是賣家 要加商品列表 還沒完成*/}
              {userData!==null&&(
                <>
                  <Nav.Link as={Link} to="/notifications">通知中心</Nav.Link>
                  <NavDropdown title={userData.username} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/orders">我的訂單</NavDropdown.Item>  
                    <NavDropdown.Item as={Link} to="/memberInfo">我的資料</NavDropdown.Item>
                                                                                                                
                  </NavDropdown>
                </>
              )}    
              {/*未登錄顯示登錄/註冊 已登錄顯示 使用者名稱 完成*/}
              {userData===null&&(
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
