import "../css/util/sidePage.css";

const SidePage = ({ isOpen, onClose, headerText, content }) => {
    if (!isOpen) return null;

    return (
        <>
        <div className="side-backdrop" onClick={onClose} />
        <div className="side-page">
            {headerText !== '' &&
            <div className="side-header">
                <button type="button" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" height="25" width="20.5" viewBox="0 0 320 512">
                    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                </svg>
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