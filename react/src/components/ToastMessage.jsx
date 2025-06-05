import React, { useContext, useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { AppContext } from '../contexts/AppContext';

function ToastMessage() {
  const { toastMessages, removeToastMessage } = useContext(AppContext);

  // 這裡維護每個 toast 的顯示狀態，避免 show 一直是 true 不變
  const [showStates, setShowStates] = useState({});

  // 當 toastMessages 有新增，設定對應的 show 為 true
  useEffect(() => {
    const newShowStates = { ...showStates };
    toastMessages.forEach(({ id }) => {
      if (newShowStates[id] === undefined) {
        newShowStates[id] = true;
      }
    });
    setShowStates(newShowStates);
  }, [toastMessages]);

  // 當 toast 關閉時呼叫，並更新狀態，然後移除該 toast
  const handleClose = (id) => {
    setShowStates((prev) => ({ ...prev, [id]: false }));
    // 等 200ms 動畫結束再移除
    setTimeout(() => {
      removeToastMessage(id);
      setShowStates((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 200);
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {toastMessages.map(({ id, text }) => (
        <Toast
          key={id}
          show={showStates[id] ?? true}
          autohide
          delay={3000}
          onClose={() => handleClose(id)}
          bg="success"
        >
          <Toast.Body className="text-white">{text}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default ToastMessage;
