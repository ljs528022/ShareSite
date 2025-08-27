import "../../css/pages/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useUser } from "../../services/UserContext";
import { getUserInfo } from "../../services/getUserInfo";
import { useToast } from "../../util/ToastContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";

const Login = () => {

    const [ userData, setUserData ] = useState({
        username: "",
        password: "",
    });

    const [ autoLoginChecked, setAutoLoginChecked ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    
    const { setUser } = useUser();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // 로그인 요청
            const { data } = await postData("/user/login", userData);

            // 로그인이 성공하면, 토큰 저장
            const token = data.token;
            if(autoLoginChecked) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }

            // 토큰을 이용해 유저 정보 가져오기
            const userInfo = await getUserInfo();
            
            // 해당 유저 상태(state) 확인
            const userState = userInfo?.state;
            if(userState === "N") {     // 상태가 "N" 이면 로그인 진행
                setUser(userInfo);
                showToast(`로그인 성공! ${userInfo.useralias}님 어서오세요!`);
                navigate("/");
            } else if(userState === "R") {  // 상태가 "R" 이면 탈퇴 취소를 할지 질문, 확인하면 탈퇴 취소 및 로그인, 취소하면 로그인 취소 
                const result = confirm("탈퇴 처리 중인 계정입니다. 탈퇴를 취소하시겠습니까?");
                if(result) {
                    const res = await postData("/user/cancel-withdraw", userData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(res.status === 200) {
                        setUser(userInfo);
                        showToast(`탈퇴 요청이 취소되었습니다. ${userInfo.useralias}님 어서오세요!`);
                        navigate("/");
                    }
                } else {
                    showToast("로그인이 중단되었습니다. Home으로 이동합니다.", "error");
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    navigate("/");
                }
            } else if(userState === "S") {
                confirm("이미 탈퇴 처리된 계정입니다. Home으로 이동합니다.");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                navigate("/");
            }

        } catch (err) {
            console.log("로그인 실패...", err);
            showToast("아이디나 비밀번호가 올바르지 않습니다", "error");
        }

    };

    const toggleAutoLoginChekc = () => {
        setAutoLoginChecked(prev=> !prev);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    }


    return (
        <>
        <main>
            <div className="login-container">
                <h3>어서오세요! 환영합니다.</h3>
                <div className="login-box">
                    <form className="login-form" onSubmit={handleLogin}>
                        {/* ID & PW INPUT Part */}
                        <div className="form-row">
                            <div className="login-input">
                                <label>ID :</label>
                                <input id="username" type="text" onChange={handleInput}/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="login-input">
                                <label>PW :</label>
                                <input id="password" type={showPassword ? "text" : "password"} autoComplete="off" onChange={handleInput}/>
                                <button type="button" className="login-side-btn" onClick={togglePasswordVisibility}>
                                {showPassword ?
                                    <FaRegEyeSlash size={20} />
                                    :
                                    <FaRegEye size={20} />
                                }
                                </button>
                                <div className="auto-login">
                                    {/* 로그인 유지하기 기능 만들어야 함 */}
                                    <button type="button" className="auto-login" onClick={toggleAutoLoginChekc}>
                                        {autoLoginChecked ?
                                        <FaCheckCircle size={15} color="#74C0FC" />
                                        :
                                        <FaRegCheckCircle size={15} color="#74C0FC" />
                                        }
                                        {` 로그인 유지하기`} 
                                    </button>
                                    <button className="login-btn" type="submit" >시작하기</button>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                                <a className="register-link" href="/user/signup">회원이 되고 싶으신가요?</a>
                                {/* API Login */}
                                {NaverLoginBtn()}
                                {KakaoLoginBtn()}
                                {GoogleLoginBtn()}
                        </div>
                    </form>
                </div>
            </div>
        </main>
        </>
    )
}

const NaverLoginBtn = () => {
    const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent('http://localhost:5178/oauth/naver/callback');
    const STATE = Math.random().toString(36).substring(2, 15);

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem("naver_state", STATE);
        const naverAuthUrl  = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
        window.location.href = naverAuthUrl;
    };

    return (
        <button onClick={handleLogin} style={{ background: "#00DE5A", color: "white"}} className="api-login">
            네이버로 함께하기
        </button>
    );
}

const KakaoLoginBtn = () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent("http://localhost:5178/oauth/kakao/callback");

    const handleLogin = (e) => {
        e.preventDefault();
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
        window.location.href = kakaoAuthUrl;
    }

    return (
        <button onClick={handleLogin} style={{ background: "#FEE500" , color: "#000000 85%"}} className="api-login">
            카카오로 함께하기
        </button>
    )
}

const GoogleLoginBtn = () => {

    const handleLogin = (e) => {
        e.preventDefault();
        const googleAuthUrl = `"http://localhost:5178/oauth2/authorization/google"`;
        window.location.href = googleAuthUrl;
    }
    
    return (
        <button onClick={handleLogin} style={{ background: "white", border: "2px solid rgba(0,0,0,0.7)", color: "rgba(0,0,0,0.8)"}} className="api-login">
            구글 계정으로 함께하기
        </button>
    )
}

export default Login;