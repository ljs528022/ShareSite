import "../css/util/modal.css";

const ModifyModal = ({ isOpen, onClose, onConfirm, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modify-modal-backdrop">
            <div className="modify-modal-container">
                {title && <h2 className="modify-modal-title">{title}</h2>}
                {content}
                <div className="modify-modal-buttons">
                    <button className="modify-modal-button-confirm" onClick={onConfirm}>제출</button>
                </div>
            </div>
        </div>
    );
};

export default ModifyModal;