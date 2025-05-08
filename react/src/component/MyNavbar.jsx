import { useState } from 'react';  // 加入 useState 引入
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/myNavbar.css';                     //它專屬的css
import WelcomePage from './pages/WelcomePage.jsx' // 歡迎頁面 暫時是首頁
import RecentPage from './pages/RecentPage.jsx' // 頁面 
import NoticePage from './pages/NoticePage.jsx' // 頁面 
import LoginPage from './pages/LoginPage.jsx' // 頁面 
import ProductCard from './ProductCard'; // 產品卡片 測試用 暫時
import MySearch from './MySearch.jsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CartModal from './CartModal'; // 確認 CartModal 是否正確引入

function MyNavbar({ onChangeContent }) {
  const [showCart, setShowCart] = useState(false);

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  const product={                                 // 產品卡片 測試用 暫時
    id: 1,
    name: '測試商品',
    price: 199,
    imageUrl: 'https://via.placeholder.com/150',
    description: '這是一個假商品，用來測試卡片功能。',
  }
  

  return (
    <>
      <Navbar expand="lg" fixed="top" className='mynavbar'>
        <Container>
          <Navbar.Brand onClick={() => onChangeContent(<WelcomePage/>)}>左上角的</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav>
              <NavDropdown title="商品分類" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => onChangeContent(<ProductCard product={product} />)}>測試商品卡片</NavDropdown.Item>   
                <NavDropdown.Item href="#action/3.2">之後串後端資料</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">之後串後端資料</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => onChangeContent(<RecentPage/>)}>最近看過</Nav.Link>
              <Nav.Link onClick={handleShowCart}>購物車</Nav.Link>
              <Nav.Link onClick={() => onChangeContent(<RecentPage/>)}>會員中心</Nav.Link>
              <Nav.Link onClick={() => onChangeContent(<NoticePage/>)}>通知中心</Nav.Link>
              <Nav.Link onClick={() => onChangeContent(<LoginPage/>)}>登錄/註冊</Nav.Link>
            </Nav>
            <MySearch />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CartModal show={showCart} handleClose={handleCloseCart} />
    </>
  );
}

export default MyNavbar;
