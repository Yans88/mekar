import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../button/Button'

const AppModal = ({
    children,
    handleClose,
    title,
    isLoading,
    form,
    formSubmit,
    titleButton,
    themeButton,
    noBtnAction,
    ...otherProps
}) => {
    return (
        // eslint-disable-next-line react/button-has-type
        <Modal
            {...otherProps}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{form}</Modal.Body>

            {!noBtnAction ? (
                <Modal.Footer>
                    <Button theme="info" onClick={handleClose}>
                        Close
                     </Button>
                    <Button
                        isLoading={isLoading}
                        theme={themeButton}
                        onClick={formSubmit}
                    >
                        {titleButton ? titleButton : "Yes"}
                    </Button>
                </Modal.Footer>
            ) : null}


        </Modal>
    );
};

export default AppModal;
