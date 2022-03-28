import React from 'react';
import { Modal } from 'react-bootstrap';

interface IModal {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    body: JSX.Element | string;
    footer?: JSX.Element | string;
}

function Modals({ title, onClose, isOpen, body, footer }: IModal) {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
    );
}

export default Modals;
