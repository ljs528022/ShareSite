import "../../css/pages/withdraw.css";
import { useState } from "react";
import { useToast } from "../../util/ToastContext";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useUser } from "../../services/UserContext";

const SocialWithdraw = ({ user }) => {

    const [ confirmText, setConfirmText ] = useState("");

    const { setUser } = useUser();

    const { showToast } = useToast();
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    const postWithdraw = async () => {
        if(!user) return;

        const checkText = "지금 사이트를 탈퇴하겠습니다";

        if(!user ||confirmText !== checkText) {
            showToast("확인 문구가 일치하지 않습니다.", "error");
            return;
        }

        try {
            const response = await postData(`/user/withdraw/social`, {
                userKey: user?.userKey
            });
            if(response.status === 200) {
                localStorage.clear();
                sessionStorage.clear();
                setUser(null);
                navigate("/withdraw-complete");
            }
        } catch {
            showToast("탈퇴 처리에 문제가 발생했습니다...", "error")
        }
    }

    if(!user) return;
    
    return (
        <div className="withdraw-container">
            <p className="withdraw-p">
            {`확실한 탈퇴를 위해 입력창에 보이는 문구을 똑같이 입력해주세요.`}
            </p>
            <input 
                className="withdraw-input"
                type="text" 
                placeholder="지금 사이트를 탈퇴하겠습니다" 
                onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="withdraw-box">
                <button type="button" className="withdraw-btn" onClick={postWithdraw}>확인</button>
            </div>
        </div>
    ); 
}

export default SocialWithdraw;