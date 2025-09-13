import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import Cookies from "js-cookie";
import MailVerification from "../../services/mailVerification";
import "../../css/pages/signup.css";

const SocialSignup = () => {
    const location = useLocation();
    const { email, name, id } = location.state || {};

    const [ tokenType, setTokenType ] = useState(null);
    const [ signUp, setSignUp ] = useState({
        username: "",
        useralias: "",
        email: "",
        emailChk: false,
    });

    const [ userVerify, setUserVerify ] = useState({
        usernameChk: 0,   // 0: 초기값, 1: 중복됨, 2: 미입력, 3: 사용가능
    });

    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // 쿠키로 Google Email 받아오기.
        fetch("http://localhost:8093/api/auth/temp-info", {
            method: "GET",
            credentials: "include"
        }).then(res => res.json())
        .then(data => {
            sessionStorage.setItem("googleAccessToken", data.email);
        });

        const naverToken = sessionStorage.getItem("naverAccessToken") || null;
        const kakaoToken = sessionStorage.getItem("kakaoAccessToken") || null;
        const googleToken = sessionStorage.getItem("googleAccessToken") || null;

        if(naverToken !== null) {
            setTokenType("N");
        } else if (kakaoToken !== null) {
            setTokenType("K");
        } else if (googleToken !== null) {
            setTokenType("G");
            setSignUp(prev => ({...prev, email: googleToken, emailChk: true}));
        }
    }, [tokenType]);

    const handleInput = (e) => {
        const { id, value } = e.target;
        setSignUp(prev => ({ ...prev, [id]: value}));
    };

    const handleEmailVerify = useCallback((verified) => {
        setSignUp((prev => ({ ...prev, emailChk: verified})));
    }, []);

    // ID 중복확인
    const idChk = async () => {
        console.log(signUp);

        if(signUp.username === "") {
            setUserVerify(prev => ({
                ...prev,
                usernameChk: 2,
            }))
            return;
        }
        // 서버에 저장된 username 중 중복된 값이 있는지 확인
        try {
            const res = await postData("/api/usernameChk", { username: signUp?.username });
            const { isTaken } = res.data;
            setUserVerify(prev => ({
                ...prev,
                usernameChk: isTaken ? 1 : 3,
            }));
        } catch (err) {
            console.error("아이디 중복 확인 오류:", err);
            showToast("서버와의 통신 중 오류가 발생했습니다...", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(signUp?.useralias === "") {
            showToast("모든 항목을 올바르게 입력해주세요.", "error");
            return;
        }

        try {
            const res = await postData("/user/signup/social", {
                username: id || signUp.username,
                useralias: signUp.useralias,
                email: signUp?.emailChk !== "" ? signUp?.email : email,
                tokenType: tokenType,
            });
            
            if(res.status === 200) {
                showToast("회원가입이 완료되었습니다!", "success");
                sessionStorage.removeItem("naverAccessToken");
                sessionStorage.removeItem("kakaoAccessToken");
                Cookies.remove("jwt");

                navigate("/user/login");
            } else {
                sessionStorage.removeItem("naverAccessToken");
                sessionStorage.removeItem("kakaoAccessToken");
                Cookies.remove("jwt");
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
                        {!id ?
                        <div className="form-input">
                            <label>ID :</label>
                            <input className="signup-input" id="username" type="text" value={signUp.username} onChange={handleInput} placeholder="아이디를 입력해주세요" />
                            <button className="signup-side-btn" type="button" onClick={idChk}>중복확인</button>
                                    <span className="error-message" style={userVerify.usernameChk <= 2 ? {color: "red"} : {color: "green"}}>
                                        {userVerify.usernameChk <= 0 ? "" : 
                                        userVerify.usernameChk <= 1 ? "이미 사용중인 ID 입니다!" 
                                        : userVerify.usernameChk <= 2 ? "아이디는 필수 입력 사항입니다!" 
                                        : "사용 가능한 ID 입니다!"}
                                    </span>
                        </div>
                        :
                        <div className="form-input-disabled">
                            <label>ID :</label>
                            <input className="signup-input-disabled" id="username" type="text" placeholder="소셜 로그인 서비스로 진행합니다" disabled />
                        </div>
                        }
                    </div>
                    <div className="form-row">
                        <div className="form-input">
                            <label>NICK :</label>
                            <input className="signup-input" id="useralias" type="text" value={signUp.useralias} onChange={handleInput} placeholder={name || "닉네임을 입력해주세요"} />
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
                            <MailVerification email={signUp?.email} onVerify={handleEmailVerify} style={"signup-"} />
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