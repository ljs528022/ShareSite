import { FaTimesCircle } from "react-icons/fa";
import "../css/pages/itemDetail.css";

const EmptyBox = ({ content }) => {
    if(!content) return;

    return (
    <div className="item-empty">
        <FaTimesCircle size={32} color="#aaa" />
        <p>
            {content}
        </p>
    </div> 
    );
}

export default EmptyBox;