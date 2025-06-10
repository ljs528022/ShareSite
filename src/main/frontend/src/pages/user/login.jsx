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
    })
    const navigate = useNavigate();
    const [ autoLoginChecked, setAutoLoginChecked ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);

    const { setUser } = useUser();
    const { showToast } = useToast();


    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Request Login
            const { data } = await postData("/user/login", userData);

            // if Login Success, Save Token
            const token = data.token;
            if(autoLoginChecked) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
            }

            const userInfo = await getUserInfo();
            setUser(userInfo);
            showToast(`로그인 성공! ${userData.username}님 어서오세요!`);
            navigate("/home");
        } catch (err) {
            console.log("로그인 실패...", err);
            showToast("로그인 정보가 올바르지 않은거 같아요!", "error");
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
                                <a className="register-link" href="/user/register">회원이 되고 싶으신가요?</a>
                                {/* API Login */}
                                <button onClick={null} style={{ background: "#00DE5A", color: "white"}} className="api-login">
                                    네이버로 함께하기
                                </button>
                                <button onClick={null} style={{ background: "#FEE500" , color: "#000000 85%"}} className="api-login">
                                    카카오로 함께하기
                                </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        </>
    )
}

const NaverLogin = () => {

}

const KakaoLogin = () => {

}

export default Login;