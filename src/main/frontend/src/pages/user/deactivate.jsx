import { useState } from "react";
import { useToast } from "../../util/ToastContext";
import "../../css/pages/deactivate.css";
import { postData } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Deactivate = ({ user, onClose }) => {

    const [ confirmText, setConfirmText ] = useState("");

    const { showToast } = useToast();
    const navigate = useNavigate();

    const postDeactivate = async () => {
        const checkText = "지금 사이트를 탈퇴하겠습니다";

        if(!user ||confirmText !== checkText) {
            showToast("확인 문구가 일치하지 않습니다.", "error");
            return;
        }

        const userKey = user.userKey; 
        const token = sessionStorage.getItem("token")
        try {
            const response = await postData(`/user/deactivate/${userKey}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if(response.status === 200) {
                navigate("/user/deactivate");
            }
        } catch {
            showToast("통신 장애가 발생했습니다...", "error")
        }
    }

    if(!user) return;
    
    return (
        <div className="deactivate-container">
            <p className="deactivate-p">
            {`확실한 탈퇴를 위해 입력창에 보이는 문구을 똑같이 입력해주세요.`}
            </p>
            <input 
                className="deactivate-input"
                type="text" 
                placeholder="지금 사이트를 탈퇴하겠습니다" 
                onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="deactivate-box">
                <button className="deactivate-btn" onClick={postDeactivate}>확인</button>
            </div>
        </div>
    ); 
}

export default Deactivate;