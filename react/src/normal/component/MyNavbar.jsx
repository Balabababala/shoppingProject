import { useEffect,useState } from 'react';  // 
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyNavbar.css';  // 它專屬的css
import { Link } from 'react-router-dom'; // 引入 Link
import ProductCard from './ProductCard'; // 產品卡片 測試用 暫時 應該要在推薦
import MySearch from './MySearch.jsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';  // 正確導入 NavDropdown
import MyNavbarCategories from './MyNavbarCategories.jsx';
function MyNavbar({ onChangeContent }) {
  const [categories, setCategories] = useState([]);
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
    setTimeout(() => setShowCart(false),200);  // 延遲隱藏，給使用者足夠時間去點擊
  };

   useEffect(() => {
    fetch("http://localhost:8080/categoriestomynavbar")
      .then(resp => resp.json())
      .then(data => {
        setCategories(data); // 假設資料格式為 [{id, name}]
      })
      .catch(error => console.error("載入分類資料失敗:", error));
  }, []);

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
              <Nav.Link as={Link} to="/recent">最近看過</Nav.Link>
              <div
              className="cart-link-wrapper"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Nav.Link className="cart-link">購物車</Nav.Link>

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
                <Button as={Link} to="/cart" variant="primary">
                  去結帳
                </Button>
                </div>
            </div>
             
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
