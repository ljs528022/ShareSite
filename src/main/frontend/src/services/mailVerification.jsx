import { useState, useEffect, useRef } from "react";
import { postData } from "./api.jsx";

export default function MailVerification({ email, onVerify, style = "" }) {
    const [emailVerification, setEmailVerification] = useState({
        sent: false,
        code: "",
        serverCode: "",
        verified: false,
        showInput: false,
        expired: true,
        secondsLeft: 0
    });
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if(!emailVerification.showInput || emailVerification.secondsLeft <= 0 || emailVerification.verified) return;
    
        const timer = setInterval(() => {
            setEmailVerification(prev => {
                const next = prev.secondsLeft - 1;

                if(next <= 0) {
                    clearInterval(timer);
                    return {
                        ...prev,
                        secondsLeft: 0,
                        expired: !prev.verified,
                        showInput: !prev.verified,
                    };
                }
                return {
                    ...prev,
                    secondsLeft: next
                };
            });
        }, 1000);
    
        return () => clearInterval(timer);
    }, [emailVerification.secondsLeft, emailVerification.showInput, emailVerification.verified]);

    const hasVerifiedRef = useRef(false);   // 한번만 실행되게 만들기기
    useEffect(() => {
        if(emailVerification.verified && typeof onVerify === "function") {
            hasVerifiedRef.current = true;
            onVerify(true);
        }
    }, [emailVerification.verified, onVerify]);
    
    const handleSendCode = async () => {
        if(!email) {
            alert("이메일을 입력해주세요!");
            return;
        }

        setLoading(true);

        try {
            const { data } = await postData("/api/send-code", { email });
            setEmailVerification(prev => ({
                ...prev,
                sent: true,
                serverCode: data.code,
                showInput: true,
                expired: false,
                secondsLeft: 60,
                verified: false,
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
            verified: inputCode === prev.serverCode 
        }));
    };
    
    const formatTime = (sec) => {
        const min = Math.floor(sec / 60);
        const secLeft = sec % 60;
        return `${min}:${secLeft.toString().padStart(2, '0')}`;
    }

    return (
        <>
            <button className={`${style}side-btn`} type="button" onClick={handleSendCode}>{loading ? "요청중..." : "메일인증"}</button>
            {emailVerification.sent && (
                <>
                    <input id="mailChk" type="text" placeholder="인증번호 입력" autoComplete="off" onChange={handleCodeChange}/>
                    {!emailVerification.verified && (
                        <p id="timer">{formatTime(emailVerification.secondsLeft)}</p>
                    )}
                </>
            )}
            {emailVerification.sent && emailVerification.expired && !emailVerification.verified && (
                <p id="timeOut">인증 시간이 만료되었습니다. 다시 요청해주세요.</p>
            )}
            {emailVerification.sent && emailVerification.verified && (
                <p id="verify-success">인증이 완료되었습니다.</p>
            )}
        </>
    )
}