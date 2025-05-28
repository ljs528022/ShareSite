import "../css/util/modal.css";

const EditModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
    <>
        <div className="edit-modal-backdrop" onClick={onClose} />
        <div className="edit-modal-container">
            <button type="button" className="edit-modal-btn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" height="22" width="19" viewBox="0 0 384 512">
                    <path fill="#555" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
            {title && <h2 className="edit-modal-title">{title}</h2>}
            {content}
        </div>
    </>
    );
};

export default EditModal;