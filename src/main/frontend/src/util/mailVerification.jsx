import { useState, useEffect } from "react";
import { postData } from "../services/api.jsx";
import Buttons from "./buttons";

export default function MailVerification({ email, onVerify }) {
    const [emailVerification, setEmailVerification] = useState({
        sent: false,
        code: "",
        serverCode: "",
        verfied: false,
        showInput: false,
        expired: true,
        secondsLeft: 0
    });
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if(!emailVerification.showInput || emailVerification.secondsLeft <= 0 || emailVerification.verfied) return;
    
        const timer = setInterval(() => {
            setEmailVerification(prev => {
                const next = prev.secondsLeft - 1;

                if(next <= 0) {
                    clearInterval(timer);
                    return {
                        ...prev,
                        secondsLeft: 0,
                        expired: !prev.verfied,
                        showInput: !prev.verfied,
                    };
                }
                return {
                    ...prev,
                    secondsLeft: next
                };
            });
        }, 1000);
    
        return () => clearInterval(timer);
    }, [emailVerification.secondsLeft, emailVerification.showInput, emailVerification.verfied]);
    
    const handleSendCode = async () => {
        if(!email) {
            alert("이메일을 입력해주세요!");
            return;
        }

        setLoading(true);

        try {
            const data = await postData("/api/send-code", { email });
            setEmailVerification(prev => ({
                ...prev,
                sent: true,
                serverCode: data.code,
                showInput: true,
                expired: false,
                secondsLeft: 60,
                verfied: false,
            }));
        } catch (err) {
            console.log("이메일 인증 오류: ", err);
            alert("인증 메일 전송 실패");
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (e) => {
        const inputCode = e.target.value;
        setEmailVerification(prev => ({
            ...prev,
            code: inputCode,
            verfied: inputCode === prev.serverCode
        }));
        
        // 인증코드가 맞으면 onVerify를 true로 만들어 부모개체의 값을 변경.
        if(emailVerification.verfied && !onVerify) {
            onVerify(true);
        }
    };
    
    const formatTime = (sec) => {
        const min = Math.floor(sec / 60);
        const secLeft = sec % 60;
        return `${min}:${secLeft.toString().padStart(2, '0')}`;
    }

    return (
        <>
            <Buttons 
                btnClassname={"mailCheck"} 
                btnType={"button"} 
                btnText={loading ? "요청중..." : "메일인증"} 
                btnOnClick={handleSendCode}
            />
            {emailVerification.sent && (
                <>
                    <input id="mailChk" type="text" placeholder="인증번호 입력" onChange={handleCodeChange}/>
                    {!emailVerification.verfied && (
                        <p id="timer">{formatTime(emailVerification.secondsLeft)}</p>
                    )}
                </>
            )}
            {emailVerification.sent && emailVerification.expired && !emailVerification.verfied && (
                <p id="timeOut">인증 시간이 만료되었습니다. 다시 요청해주세요.</p>
            )}
            {emailVerification.sent && emailVerification.verfied && (
                <p id="verify-success">인증이 완료되었습니다.</p>
            )}
        </>
    )
}

