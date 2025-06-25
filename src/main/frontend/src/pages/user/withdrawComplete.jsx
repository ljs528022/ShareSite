import { useNavigate } from "react-router-dom";
import "../../css/pages/withdraw.css";

const WithdrawComplete = () => {

    const navigate = useNavigate();

    return (
        <main>
            <h3 style={{marginTop: "50px"}}>그동안 이용해 주셔서 감사합니다!</h3>
            <div className="withdraw-complete-box">
                <p>탈퇴가 정상적으로 처리되었습니다.</p>
                <p>탈퇴한 계정은 일주일 후 삭제처리 되며</p>
                <p>그 전에 재로그인 시 탈퇴처리가 취소됩니다.</p>
                <button className="withdraw-complete-btn" onClick={() => navigate("/home")}>Home 으로 돌아가기</button>
            </div>
        </main>
    )
}

export default WithdrawComplete;