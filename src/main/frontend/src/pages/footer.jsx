import { useNavigate } from "react-router-dom";
import { useUser } from "../services/UserContext";
import "../css/pages/home.css"

const Footer = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <>
        <footer>
            <div className="footer-wrapper">
                <span>제작자: @이정식</span>
                {user?.auth === "ADMIN" &&
                <a style={{textDecoration: "underline"}} href="/admin">관리자 페이지</a>
                }
            </div>
        </footer>
        </>
    )
}

export default Footer;