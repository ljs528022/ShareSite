import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import "../../css/pages/signup.css";

const SocialSignup = () => {
    const location = useLocation();
    const { email, name, id, accessToken } = location.state || {};

    const [ nickname, setNickname ] = useState("");

    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(nickname === "") {
            showToast("모든 항목을 올바르게 입력해주세요.", "error");
            return;
        }

        try {
            const res = await postData("/user/signup/social", {
                username: id,
                useralias: nickname,
                email: email,
                accessToken: accessToken
            })
            if(res.status === 200) {
                showToast("회원가입이 완료되었습니다!", "success");
                navigate("/user/login");
            }
        } catch {
            showToast("회원가입이 실패했습니다... 다시 시도해주세요.", "error");
        }
    }

    return (
    <main>
        <div className="singup-container">
            <h3>간편 회원가입</h3>
            <div className="signup-box">
                <form className="singup-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-input-disabled">
                            <label>ID :</label>
                            <input className="signup-input-disabled" id="username" type="text" value={"네이버에 저장된 정보로 가입합니다"} disabled />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-input">
                            <label>NICK :</label>
                            <input className="signup-input" id="useralias" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={name} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-input">
                            <label>MAIL :</label>
                            <input className="signup-input-disabled" id="email" type="text" value={"네이버에 저장된 정보로 가입합니다"} disabled />
                        </div>
                    </div>

                    <button className="signup-btn" type="submit">제출</button>
                </form>
            </div>
        </div>
    </main>
    )
}

export default SocialSignup;