import { FaAngleRight } from "react-icons/fa";
import "../css/util/sidePage.css";

const SidePage = ({ isOpen, onClose, headerText = '', content }) => {
    if (!isOpen) return null;

    return (
        <>
        <div className="side-backdrop" onClick={onClose} />
        <div className="side-page">
            {headerText !== '' &&
            <div className="side-header">
                <button type="button" onClick={onClose}>
                    <FaAngleRight size={35} />
                </button>
                <label>
                    {headerText}
                </label>
            </div>
            }
            <div className="side-content-container">
                <div className={`side`}>
                    {content}
                </div>
            </div>
        </div>
        </>
    )
};

export default SidePage;