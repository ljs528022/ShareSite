import "../css/util/modal.css";

const Modal = ({ isOpen, onClose, onConfirm, style = "", title, message, confirmText, cancelText }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className={`${style}modal-container`}>
                {title && <h2 className={`${style}modal-title`}>{title}</h2>}
                {message && <p className="modal-message">{message}</p>}
                <div className={`${style}modal-buttons`}>
                    <button className={`${style}modal-button-cancel`} onClick={onClose}>{cancelText}</button>
                    <button className={`${style}modal-button-confirm`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;