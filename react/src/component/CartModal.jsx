// src/component/CartModal.jsx
import { Modal, Button, ListGroup } from 'react-bootstrap';

function CartModal({ show, handleClose }) {
  // 假資料，可之後串後端替換
  const cartItems = [
    { id: 1, name: '商品A', price: 100 },
    { id: 2, name: '商品B', price: 200 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>購物車</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {cartItems.map(item => (
            <ListGroup.Item key={item.id}>
              {item.name} - ${item.price}
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
