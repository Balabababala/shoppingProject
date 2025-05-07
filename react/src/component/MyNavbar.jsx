import { useState } from 'react';  // 加入 useState 引入
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/myNavbar.css';
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

  return (
    <>
      <Navbar expand="lg" fixed="top" className='mynavbar'>
        <Container>
          <Navbar.Brand onClick={() => onChangeContent("歡迎來到首頁")}>左上角的</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav>
              <NavDropdown title="商品分類" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">之後串後端資料</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => onChangeContent("最近看過暫時")}>最近看過</Nav.Link>
              <Nav.Link onClick={handleShowCart}>購物車</Nav.Link>
              <Nav.Link onClick={() => onChangeContent("會員中心暫時")}>會員中心</Nav.Link>
              <Nav.Link onClick={() => onChangeContent("通知中心暫時")}>通知中心</Nav.Link>
              <Nav.Link onClick={() => onChangeContent("登錄/註冊暫時")}>登錄/註冊</Nav.Link>
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
