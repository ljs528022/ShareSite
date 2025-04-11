import { useState, useEffect, useCallback } from "react";
import "/src/components/css/login.css";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../services/api";
import Buttons from "../../util/buttons";
import MailVerification from "../../util/mailVerification";

const Register = () => {

    const navigate = useNavigate();
    const [ userData, setUserData ] = useState({
        username: "",
        password: "",
        passwordChk: "",
        useralias: "",
        email: "",
    });


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
        setUserData(prev => ({
            ...prev,
            [id]: value
        }));
    }
    
    useEffect(() => {
        const passChk = (pw) => {
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':",.<>/?\\|`~]).{8,16}$/;
            return regex.test(pw);
        }

        const passVaild = (userData.password == userData.passwordChk);
        if(userData.password === "" || null) {
            setUserVerify(prev => ({
                ...prev,
                passwordChk: 4,
            }))
        } else 
        {
            if(!passVaild && !passChk(userData.password)) {
                setUserVerify(prev => ({
                    ...prev,
                    passwordChk: 0,
                }));
            }
            if (passVaild && !passChk(userData.password)) {
                setUserVerify(prev => ({
                    ...prev,
                    passwordChk: 1,
                }));
            } 
            if (!passVaild && passChk(userData.password)) {
                setUserVerify(prev => ({
                    ...prev,
                    passwordChk: 2,
                }));
            } 
            if (passVaild && passChk(userData.password)) {
                setUserVerify(prev => ({
                    ...prev,
                    passwordChk: 3,
                }));
            }
        }
        
        // password가 입력되면 paasswordChk 입력란이 나타나게 하기
        const x = document.getElementById("passwordCheck");
        if(userData.password !== "" || null) {
            x.style.display = "inline-block"
        } else {
            x.style.display = "none"
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
            alert("서버와의 통신 중 오류가 발생했습니다...");
        }
    };
    
    // 메일 인증 값 handle
    const handleEmailVerify = useCallback((verified) => {
        setUserVerify((prev => ({ ...prev, emailChk: verified })));
    }, []);

    // 회원가입 등록록
    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!isFormVaild) {
            alert("모든 항목을 올바르게 입력해주세요.");
            return;
        }

        try {
            const res = await postData("/user/register", {
                username: userData.username,
                password: userData.password,
                useralias: userData.useralias,
                email: userData.email,
            });

            alert("회원가입이 완료되었습니다!");
            navigate("/user/login")
        } catch (err) {
            console.log("회원가입이 실패했습니다...", err);
            alert("회원가입이 실패했습니다... 다시 시도해주세요.");
        }
    }


    return (
        <>
            <main>
                <div className="regist-wrapper">
                    <h3>회원님의 정보를 입력해주세요.</h3>
                    <form id="register" className="registerBox" onSubmit={handleSubmit}>
                        <div className="registerInput">
                            <label id="id">
                                <p>ID:</p>
                                <input id="username" type="text" onChange={handleInput}/>
                                <Buttons btnClassname={"idCheck"} btnType={"button"} btnText={"중복확인"} btnOnClick={idChk} />
                                <span id="idError" style={userVerify.usernameChk <= 2 ? {color: "red"} : {color: "green"}}>
                                    {userVerify.usernameChk <= 0 ? "" : 
                                        userVerify.usernameChk <= 1 ? "이미 사용중인 ID 입니다!" :
                                        userVerify.usernameChk <= 2 ? "아이디는 필수 입력 사항입니다!" : "사용 가능한 ID 입니다!"}
                                </span>
                            </label>
                            <label>
                                <p>PW:</p>
                                <input id="password" type="text" placeholder="8~16글자, 대문자, 숫자 특수문자를 최소 한개 포함" onChange={handleInput}/>
                                <span id="pwError" style={{color: "red"}}>{(userData.password != null && userVerify.passwordChk >= 2) ? "" :"비밀번호 양식이 올바르지 않습니다!"}</span>
                            </label>
                            <label id="passwordCheck">
                                <input id="passwordChk" type="text" onChange={handleInput}/>
                                <span id="pwChkError" 
                                    style={userData.password != null && (userVerify.passwordChk % 2 == 1) ? 
                                    {color: "green", opacity: 1} : 
                                    {color: "red", opacity: 1}}>
                                    {(userVerify.passwordChk % 2 != 1) ? "패스워드가 일치하지 않습니다..." :"패스워드가 일치합니다!" }
                                </span>
                            </label>
                            <label>
                                <p>NICK:</p>
                                <input id="useralias" type="text" onChange={handleInput}/>
                            </label>
                            <label>
                                <p>MAIL:</p>
                                <input id="email" type="email" onChange={handleInput} placeholder="Email을 입력해주세요" />
                                <MailVerification email={userData.email} onVerify={handleEmailVerify} />
                            </label>
                                    
                            {/* sumbit 구현해야 함 */}
                            <button type="submit" onClick={handleSubmit}>제출</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register;