import { useState, useEffect, useCallback } from "react";
import "../../css/pages/register.css";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";
import MailVerification from "../../services/mailVerification";

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
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':",.<>/?\\|`~]).{8,16}$/;
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
            const isTaken = res.isTaken;
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
                                    <button className="side-btn" type="button" onClick={idChk}>중복확인</button>
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
                                    <button type="button" className="side-btn" onClick={togglePasswordVisibility}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 640 512">
                                                {showPassword ?
                                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
                                                :
                                                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>}
                                                </svg>
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
                                            <button type="button" className="side-btn" onClick={togglePasswordChkVisibility}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 640 512">
                                                {showPasswordChk ?
                                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
                                                :
                                                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>}
                                                </svg>
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
                                        <MailVerification email={userData.email} onVerify={handleEmailVerify} />
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