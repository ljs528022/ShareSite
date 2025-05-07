import "../css/util/modal.css";

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                {title && <h2 className="modal-title">{title}</h2>}
                {message && <p className="modal-message">{message}</p>}
                <div className="modal-buttons">
                    <button className="modal-button-cancel" onClick={onClose}>{cancelText}</button>
                    <button className="modal-button-confirm" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;