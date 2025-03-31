import { useState, useEffect } from "react";
import "/src/components/css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {

    const navigate = useNavigate();
    const [ userKeyChk, setUserKeyChk ] = useState(0);
    const [ userData, setUserData ] = useState({
        username: "",
        password: "",
        passwordChk: "",
        useralias: "",
        tel: "",
        regtype: "",
    })
    const { username, password, passwordChk, useralias, tel } = userData;

    // 패스워드 검사
    const passIsCollect = password === passwordChk;
    const isTelChk = false;   // 휴대폰 본인인증 확인


    // 입력되는 값들 저장장
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
    // console.log(userData);

    // ID 중복확인
    const usernameChk = () => {
        // console.log("Testing onClick!")
        
        // 서버에 저장된 username 중 중복된 값이 있는지 확인
        let nameChk = document.getElementById("username").value;

        if(username == '' || username.length == 0) {
            setUserKeyChk(2);
            return false;
        }
    }

    
    // 회원가입
    const handleSubmit = async(event) => {
        event.preventDefault();
        
        try {
            const response = await fetch("http://localhost:8093/regist")

        } catch (error) {
            console.error("아직 입력하지 않은 항목이 있습니다.", error);
        }
    }

    // 휴대폰 본인인증
    const telChk = () => {
        
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
                                <button type="button" className="idCheck" onClick={() => usernameChk()}>중복확인</button>
                                <span id="idError" style={userKeyChk <= 2 ? {color: "red"} : {color: "green"}}>
                                    {userKeyChk <= 0 ? "" : 
                                        userKeyChk <= 1 ? "이미 사용중인 ID 입니다!" :
                                            userKeyChk <= 2 ? "아이디는 필수 입력 사항입니다!" : "사용 가능한 ID 입니다!"}
                                </span>
                            </label>
                            <label>
                                <p>PW:</p>
                                <input id="password" type="text" placeholder="8~16글자, 대문자, 숫자 특수문자를 최소 한개 포함" onChange={handleInput}/>
                                <span></span>
                            </label>
                            <label id="passwordCheck" display="none">
                                <input id="passwordChk" type="text" onChange={handleInput}/>
                                <span id="pwError" style={passIsCollect ? {color: "green", opacity: 1} : {color: "red", opacity: 1}}>{passIsCollect ? "패스워드가 일치합니다" : "패스워드가 일치하지 않습니다"}</span>
                            </label>
                            <label>
                                <p>NICK:</p>
                                <input id="useralias" type="text" onChange={handleInput}/>
                            </label>
                            <label>
                                <p>TEL:</p>
                                <input id="tel" type="text" onChange={handleInput} placeholder="'-' 없이 숫자만 입력해주세요." />
                                <button className="telCheck" onClick={null}>본인인증</button>
                                <input id="telChk" type="text" />
                            </label>

                            <button type="submit" onClick={() => register()}>제출</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register;