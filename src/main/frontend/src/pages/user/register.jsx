import { useState, useEffect } from "react";
import "/src/components/css/login.css";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
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
        regtype: "",
    });

    const { username, password, passwordChk, useralias, email } = userData;

    // 회원가입 양식 확인 
    const [ useVerify, setUseVerify ] = useState({
        usernameChk: 0,
        passwordChk: true,
        emailChk: false,
    });

    const isFormVaild =
        useVerify.usernameChk === 3 &&
        useVerify.passwordChk &&
        useVerify.emailChk;


    // 입력되는 값들 저장
    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        });

        const x = document.getElementById("passwordCheck");
        if(userData.password != null) {
            x.style.display = "inline-block";
        }
        if(userData.password == "" || null) {
            x.style.display = "none";
        }
    }

    // ID 중복확인
    const idChk = () => {
        console.log("Testing onClick!")
        
        // 서버에 저장된 username 중 중복된 값이 있는지 확인

    }

    
    // 회원가입
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
            navigate("/login")
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
                    <form id="regist" className="registBox" onSubmit={handleSubmit}>
                        <div className="registInput">
                            <label id="id">
                                <p>ID:</p>
                                <input id="username" type="text" onChange={handleInput}/>
                                <Buttons btnClassname={"idCheck"} btnType={"button"} btnText={"중복확인"} btnOnClick={idChk} />
                                <span id="idError" style={useVerify.usernameChk <= 2 ? {color: "red"} : {color: "green"}}>
                                    {useVerify.usernameChk <= 0 ? "" : 
                                        useVerify.usernameChk <= 1 ? "이미 사용중인 ID 입니다!" :
                                        useVerify.usernameChk <= 2 ? "아이디는 필수 입력 사항입니다!" : "사용 가능한 ID 입니다!"}
                                </span>
                            </label>
                            <label>
                                <p>PW:</p>
                                <input id="password" type="text" placeholder="8~16글자, 대문자, 숫자 특수문자를 최소 한개 포함" onChange={handleInput}/>
                                <span></span>
                            </label>
                            <label id="passwordCheck" display="none">
                                <input id="passwordChk" type="text" onChange={handleInput}/>
                                <span id="pwError" style={useVerify.passwordChk ? {color: "green", opacity: 1} : {color: "red", opacity: 1}}>{useVerify.passwordChk ? "패스워드가 일치합니다" : "패스워드가 일치하지 않습니다"}</span>
                            </label>
                            <label>
                                <p>NICK:</p>
                                <input id="useralias" type="text" onChange={handleInput}/>
                            </label>
                            <label>
                                <p>MAIL:</p>
                                <input id="email" type="email" onChange={handleInput} placeholder="Email을 입력해주세요" />
                                <MailVerification email={email} onVerify={useVerify.emailChk}/>
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