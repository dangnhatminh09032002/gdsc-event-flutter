import React, { useLayoutEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function AlertSucess({ show, handleClose, name }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Email có thể chưa được đăng ký</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn hãy thử lại nêu vẫn không được hãy liên hệ với tụi mình để được trợ
        giúp
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
