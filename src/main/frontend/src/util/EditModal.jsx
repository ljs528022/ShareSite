import { FaXmark } from "react-icons/fa6";
import "../css/util/modal.css";

const EditModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
    <>
        <div className="edit-modal-backdrop" onClick={onClose} />
        <div className="edit-modal-container">
            <button type="button" className="edit-modal-btn" onClick={onClose}>
                <FaXmark size={30} color="#555" />
            </button>
            {title && <h2 className="edit-modal-title">{title}</h2>}
            {content}
        </div>
    </>
    );
};

export default EditModal;