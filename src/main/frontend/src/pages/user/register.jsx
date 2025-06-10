import { useState, useEffect, useCallback } from "react";
import "../../css/pages/register.css";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import MailVerification from "../../services/mailVerification";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Register = () => {

    const navigate = useNavigate();
    const { showToast } = useToast();
    const [ userData, setUserData ] = useState({
        username: "",
        password: "",
        passwordChk: "",
        useralias: "",
        email: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordChk, setShowPasswordChk] = useState(false);


    // 회원가입 양식 확인 
    const [ userVerify, setUserVerify ] = useState({
        usernameChk: 0,   // 0: 초기값, 1: 중복됨, 2: 미입력, 3: 사용가능
        passwordChk: 4,   // 0: 둘다 불일치, 1: PW만 일치, 2: 양식만 일치, 3: 둘다 일치, 4: 초기값
        emailChk: false,
    });

    const isFormVaild =     // 다 만족하면 true, 하나라도 만족 못하면 false
        userVerify.usernameChk === 3 &&
        userVerify.passwordChk === 3 &&
        userVerify.emailChk;

    // 입력되는 값들 저장
    const handleInput = (e) => {
        const { id, value } = e.target;
        setUserData(prev => ({ ...prev, [id]: value }));
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            handleSubmit(e);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    }
    const togglePasswordChkVisibility = () => {
        setShowPasswordChk(prev => !prev);
    }
    
    useEffect(() => {
        const passChk = (pw) => {
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?\\|`~]).{8,16}$/;
            return regex.test(pw);
        }

        const passVaild = (userData.password == userData.passwordChk);
        if(!userData.password) {
            setUserVerify(prev => ({
                ...prev,
                passwordChk: 4,
            }))
        } else 
        {
            if(!passVaild && !passChk(userData.password)) {
                setUserVerify(prev => ({ ...prev, passwordChk: 0 }));
            } else if (passVaild && !passChk(userData.password)) {
                setUserVerify(prev => ({ ...prev, passwordChk: 1 }));
            } else if (!passVaild && passChk(userData.password)) {
                setUserVerify(prev => ({ ...prev, passwordChk: 2 }));
            } else if (passVaild && passChk(userData.password)) {
                setUserVerify(prev => ({ ...prev, passwordChk: 3 }));
            }
        }
    }, [userData.password, userData.passwordChk, userVerify.passwordChk]);

    // ID 중복확인
    const idChk = async () => {
        if(!userData.username) {
            setUserVerify(prev => ({
                ...prev,
                usernameChk: 2,
            }))
            return;
        }
        // 서버에 저장된 username 중 중복된 값이 있는지 확인
        try {
            const res = await postData("/api/usernameChk", { username: userData.username });
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
    
    // 메일 인증 값 handle
    const handleEmailVerify = useCallback((verified) => {
        setUserVerify((prev => ({ ...prev, emailChk: verified })));
    }, []);

    // 회원가입 등록
    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!isFormVaild) {
            showToast("모든 항목을 올바르게 입력해주세요.", "error");
            return;
        }

        try {
            const res = await postData("/user/register", {
                username: userData.username,
                password: userData.password,
                useralias: userData.useralias,
                email: userData.email,
            });

            showToast("회원가입이 완료되었습니다!", "success");
            navigate("/user/login")
        } catch (err) {
            console.log("회원가입이 실패했습니다...", err);
            showToast("회원가입이 실패했습니다... 다시 시도해주세요.", "error");
        }
    }

    return (
        <>
            <main>
                <div className="register-container">
                    <h3>회원님의 정보를 입력해주세요.</h3>
                    <div className="register-box">
                        <form className="register-form" onSubmit={handleSubmit}>
                            {/* ID Part */}
                            <div className="form-row">
                                <div className="register-input">
                                    <label>ID :</label>
                                    <input id="username" type="text" value={userData.username} onChange={handleInput} onKeyDown={handleKeyDown}/>
                                    <button className="register-side-btn" type="button" onClick={idChk}>중복확인</button>
                                    <span className="error-message" style={userVerify.usernameChk <= 2 ? {color: "red"} : {color: "green"}}>
                                        {userVerify.usernameChk <= 0 ? "" : 
                                        userVerify.usernameChk <= 1 ? "이미 사용중인 ID 입니다!" 
                                        : userVerify.usernameChk <= 2 ? "아이디는 필수 입력 사항입니다!" 
                                        : "사용 가능한 ID 입니다!"}
                                    </span>
                                </div>
                            </div>

                            {/* PW Part */}
                            <div className="form-row">
                                <div className="register-input">
                                    <label>PW :</label>
                                    <input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        onChange={handleInput}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button type="button" className="register-side-btn" onClick={togglePasswordVisibility}>                        
                                    {showPassword ?
                                    <FaRegEyeSlash size={20} />
                                    :
                                    <FaRegEye size={20} />
                                    }
                                    </button>
                                    <span 
                                        className="error-message"
                                        style={{color: userVerify.passwordChk >= 4 ? "black" :
                                                userVerify.passwordChk >= 2 ? "green" : "red"}}>
                                        {(userData.password != null && userVerify.passwordChk >= 4) ? 
                                        "8~16글자, 대문자, 숫자 특수문자를 최소 한개 포함 해야합니다." 
                                        : ((userData.password != null && userVerify.passwordChk >= 2)) ? "양식이 일치합니다!"
                                        : "비밀번호 양식이 올바르지 않습니다!"}
                                    </span>
                                </div>
                            </div>

                                {/* PW Check Part */}
                                {userData.password && (
                                    <div className="form-row">
                                        <div className="register-input">
                                            <label>CHK :</label>
                                            <input id="passwordChk" type={showPasswordChk ? "text" : "password"} onChange={handleInput} />
                                            <button type="button" className="register-side-btn" onClick={togglePasswordChkVisibility}>
                                                {showPasswordChk ?
                                                <FaRegEyeSlash size={20} />
                                                :
                                                <FaRegEye size={20} />
                                                }
                                            </button>
                                            <span className="error-message"
                                                style={{ color: userVerify.passwordChk % 2 === 1 ? "green" : "red" , opacity: 1 }}>
                                                {userVerify.passwordChk % 2 === 1 ? 
                                                "패스워드가 일치합니다!" 
                                                : "패스워드가 일치하지 않습니다..."}
                                            </span>
                                        </div>
                                    </div> 
                                )}
                                
                                {/* Nickname Part */}
                                <div className="form-row">
                                    <div className="register-input">
                                        <label>NICK :</label>
                                        <input id="useralias" type="text" onChange={handleInput} onKeyDown={handleKeyDown}/>
                                    </div>
                                </div>

                                {/* Email Part */}
                                <div className="form-row">
                                    <div className="register-input">
                                        <label>MAIL :</label>
                                        <input id="email" type="email" onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Email을 입력해주세요" />
                                        <MailVerification email={userData.email} onVerify={handleEmailVerify} style={"register-"} />
                                    </div>
                                </div>
                                        
                                {/* Sumbit Part */}
                                <button className="register-btn" type="submit">제출</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Register;