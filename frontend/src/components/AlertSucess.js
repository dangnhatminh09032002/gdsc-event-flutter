import React, { useLayoutEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function AlertSucess({ show, handleClose, name }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Điểm danh thành công</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Xin chào <strong>{name}</strong>, có phải mục tiêu hôm này của bạn là
        tay phải có ny và tay trái ẳm hết quà của GDSC?
        <br />
        Chúc bạn có một buổi sự kiện thành công
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
