import { useState, useEffect } from "react";
import "/src/components/css/login.css";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();
    const [ userData, setUserData ] = useState({
        username: "",
        userpass: "",
        userpassChk: "",
        useralias: "",
        tel: "",
        regtype: "",
    })
    const { username, userpass, userpassChk, useralias, tel } = userData;

    const passIsCollect = userpass === userpassChk;

    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        });

        const x = document.getElementById("passwordCheck");
        if(userData.userpass != null) {
            x.style.display = "inline-block";
        }
        if(userData.userpass == "" || null) {
            x.style.display = "none";
        }
    }
    console.log(userData);


    const usernameChk = () => {
        

    }

    const register = () => {
        const isValid = null;
    }

    

    return (
        <>
            <main>
                <div className="regist-wrapper">
                    <h3>회원님의 정보를 입력해주세요.</h3>
                    <form id="regist" className="registBox">
                        <div className="registInput">
                            <label id="id">
                                <p>ID:</p>
                                <input id="username" type="text" onChange={handleInput} onClick={() => usernameChk()}/>
                                <button className="idCheck" onClick={null}>중복확인</button>
                                <span id="idError" style={"" ? {opacity: 1} : {opacity: 0}}>이미 사용중인 ID 입니다!</span>
                            </label>
                            <label>
                                <p>PW:</p>
                                <input id="userpass" type="text" placeholder="8~16글자, 대문자, 숫자 특수문자를 최소 한개 포함" onChange={handleInput}/>
                                <span></span>
                            </label>
                            <label id="passwordCheck" display="none">
                                <input id="userpassChk" type="text" onChange={handleInput}/>
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