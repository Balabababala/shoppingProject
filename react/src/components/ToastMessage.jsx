import React, { useContext, useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { AppContext } from '../contexts/AppContext';

function ToastMessage() {
  const { toastMessage, setToastMessage } = useContext(AppContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        setToastMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide bg="success">
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastMessage;
