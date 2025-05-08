import { useState } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

function CartModal({ show, handleClose }) {
  // cartItems 作為 state 管理
  const [cartItems, setCartItems] = useState([
    { id: 1, name: '商品A', price: 100 },
    { id: 2, name: '商品B', price: 200 },
  ]);

  const handleDelete = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>購物車</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {cartItems.map((item, index) => (
            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
              <span>{item.name} - ${item.price}</span>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(index)}>
                ✕
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <hr />
        <p>總金額：${total}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          關閉
        </Button>
        <Button variant="primary">結帳</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartModal;
