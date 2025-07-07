import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import "../../css/pages/signup.css";
import MailVerification from "../../services/mailVerification";

const SocialSignup = () => {
    const location = useLocation();
    const { email, name, id } = location.state || {};

    const [ nickname, setNickname ] = useState("");
    const [ tokenType, setTokenType ] = useState(null);
    const [ editedEmail, setEditedEmail ] = useState({
        email: "",
        emailChk: false,
    });

    const { showToast } = useToast();
    const navigate = useNavigate();

    console.log(tokenType);

    useEffect(() => {
        const naverToken = sessionStorage.getItem("naverAccessToken") || null;
        const kakaoToken = sessionStorage.getItem("kakaoAccessToken") || null;

        if(naverToken !== null && kakaoToken === null) {
            setTokenType("N");
        }
        if(naverToken === null && kakaoToken !== null) {
            setTokenType("K");
        }
    }, []);

    const handleInput = (e) => {
        const { id, value } = e.target;
        setEditedEmail(prev => ({ ...prev, [id]: value}));
    };

    const handleEmailVerify = useCallback((verified) => {
        setEditedEmail((prev => ({ ...prev, emailChk: verified})));
    }, []);

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
                email: editedEmail?.emailChk ? editedEmail?.email : email,
                tokenType: tokenType,
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
                            <input className="signup-input-disabled" id="username" type="text" placeholder="소셜 로그인 서비스로 진행합니다" disabled />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-input">
                            <label>NICK :</label>
                            <input className="signup-input" id="useralias" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={name} />
                        </div>
                    </div>
                    {email !== "" ? 
                    <div className="form-row">
                        <div className="form-input-disabled">
                            <label>MAIL :</label>
                            <input className="signup-input-disabled" id="email" type="email" placeholder="소셜 로그인 서비스로 진행합니다" disabled />
                        </div>
                    </div>
                    :
                    <div className="form-row">
                        <div className="form-input">
                            <label>MAIL :</label>
                            <input className="signup-input" id="email" type="email" onChange={handleInput} placeholder="Email을 입력해주세요" />
                            <MailVerification email={editedEmail?.email} onVerify={handleEmailVerify} style={"signup-"} />
                        </div>
                    </div>
                    }

                    <button className="signup-btn" type="submit">제출</button>
                </form>
            </div>
        </div>
    </main>
    )
}

export default SocialSignup;