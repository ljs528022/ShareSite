import { useNavigate } from "react-router-dom";
import "../../css/pages/withdraw.css";

const WithdrawComplete = () => {

    const navigate = useNavigate();

    return (
        <main>
            <h3 style={{marginTop: "50px"}}>그동안 이용해 주셔서 감사합니다!</h3>
            <div className="withdraw-complete-box">
                <p>탈퇴 요청이 정상적으로 처리되었습니다.</p>
                <p>탈퇴 후, 일주일 안에 다시 접속하시면 탈퇴 처리를 취소하실 수 있습니다.</p>
                {/* 네이버 서비스 탈퇴처리 유도 */}
                <p>다시 뵙는 날을 기대하고 있겠습니다!</p>
                <button className="withdraw-complete-btn" onClick={() => navigate("/home")}>Home 으로 돌아가기</button>
            </div>
        </main>
    )
}

export default WithdrawComplete;