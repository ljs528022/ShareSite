import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import { postData } from "../../services/api";
import MailVerification from "../../services/mailVerification";
import Modal from "../../util/Modal";
import "../../css/pages/userModify.css";

const UserModify = ({ user }) => {

    const { showToast } = useToast();
    const navigate = useNavigate();

    // 0 : 기본 창, 1 : 비밀번호 변경 창, 2: 이메일 변경 창
    const [ modifyPage, setModifyPage ] = useState(0);
    const [ isPassCorrect, setIsPassCorrect ] = useState(false); // 수정 전 비밀번호 확인
    const [ passCorrect, setPassCorrect ] = useState('');
    const [ userInfo, setUserInfo ] = useState({    // 유저 정보
        userKey: user.userKey || '',
        username: user.username || '',
        password: '',
        useralias: user.useralias || '',
        email: user.email || '',
        userimg: user.userimg || '',
        userIntro: user.userIntro || '',
    });

    // 유저 프로필 변경
    const [ modifyImg, setModifyImg ] = useState('');

    // 비밀번호 변경, 확인
    const [ passVerify, setPassVerify ] = useState(4); 
    // 0: 둘다 불일치, 1: PW만 일치, 2: 양식만 일치, 3: 둘다 일치, 4: 초기값
    const [ newPass, setNewPass ] = useState({
        password: userInfo.password,
        passwordChk: '',
    });

    // 비밀번호 보기 on / off
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordChk, setShowNewPasswordChk] = useState(false);

    // 이메일 변경, 확인
    const [ emailChk, setEmailChk ] = useState(false);   // 이메일 인증 확인
    const [ sameEmail, setSameEmail ] = useState(false); // 중복 이메일 방지
    const [ newEmail, setNewEmail ] = useState({
        email: '',
        inputEmail: '',
        subEmail: '',
    });

    const [ submitModal, setSubmitModal ] = useState(false);
    
    // 비밀번호 확인
    useEffect(() => {
        const passChk = (pw) => {
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?\\|`~]).{8,16}$/;
            return regex.test(pw);
        }
    
        const passVaild = (newPass.password == newPass.passwordChk);
        if(!newPass.password) {
            setPassVerify(4);
        } else 
        {
            if(!passVaild && !passChk(newPass.password)) {
                setPassVerify(0);
            } else if (passVaild && !passChk(newPass.password)) {
                setPassVerify(1);
            } else if (!passVaild && passChk(newPass.password)) {
                setPassVerify(2);
            } else if (passVaild && passChk(newPass.password)) {
                setPassVerify(3);
            }
        }

        if(userInfo.email === newEmail.email) {
            setSameEmail(true);
        } else setSameEmail(false);

    }, [ newPass.password, newPass.passwordChk, newEmail.email ]);

    useEffect(() => {
        if(userInfo.userimg === '') {
            setModifyImg("http://localhost:8093/item-images/temp/userImgTemp.png");
        } else if(typeof userInfo.userimg === "string" && userInfo.userimg.includes("/user-images")) {
            setModifyImg(`http://localhost:8093${userInfo.userimg}`);
        } else if(typeof userInfo.userimg === "object") {
            setModifyImg(URL.createObjectURL(userInfo.userimg));
        }
    }, [userInfo.userimg]);

    const handleInput = (e) => {
        const { id, value } = e.target;
        setUserInfo(prev => ({ ...prev, [id]: value }));
    }

    const handlePassInput = (e) => {
        const { id, value } = e.target;
        setNewPass(prev => ({...prev, [id]: value}));
    }

    const modifyPass = ( verify ) => {
        if(verify === 4) {
            showToast("비밀번호를 입력해주세요!", "error");
        } else if (verify <= 2) {
            showToast("비밀번호를 아직 변경할 수 없습니다! 모두 올바르게 입력해주세요", "error")
        }

        if(verify === 3) {
            const checkPass = async () => {
                try {
                    const response = await postData("/user/passChk", {
                        userKey: userInfo.userKey,
                        password: newPass.password
                    });

                    if(response.status === 200) {
                        showToast("동일한 비밀번호는 사용할 수 없습니다!", "error");
                        setNewPass(({password: '', passwordChk: ''}));
                    }
                } catch {
                    setUserInfo(prev => ({ ...prev, password: newPass.password}))
                    setNewPass(({ password: '', passwordChk: '', passVerify: 4}));
                    setModifyPage(0);
                    showToast("변경하신 비밀번호를 적용합니다. 저장하기를 누르면 정보가 반영됩니다", "success");
                }
            }
            checkPass();
        }
    }

    const handleImgChange = (e) => {
        const files = e.target.files;

        if(files.length > 1) {
            showToast("하나의 이미지만 선택해주세요!", "error");
            setUserInfo(prev => ({...prev, userimg: userInfo.userimg}));
        } else {
            setUserInfo(prev => ({...prev, userimg: files[0]}));
        }

        e.target.files = null;
    }

    const verifyPassword = async () => {
        try {
            const response = await postData("/user/passChk", {
                userKey: userInfo.userKey,
                password: passCorrect
            });

            if(response.status === 200) {
                showToast("비밀번호가 일치합니다!", "success");
                setIsPassCorrect(true);
            }
        } catch (err) {
            console.error("비밀번호 확인 오류:", err);
            showToast("비밀번호가 일치하지 않습니다!", "error");
            setIsPassCorrect(false);
        }
    }

    const handleEmailVerify = useCallback((verified) => {
            setEmailChk(verified);
        }, []);

    const renderUserImg = () => {
        return <img src={modifyImg} alt="유저이미지"/>;
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        const subEmail = newEmail.subEmail;

        switch (subEmail) {
            case "" :
                return setNewEmail(prev => ({...prev, inputEmail: inputEmail, email: inputEmail}));
            case "naver.com" :
                return setNewEmail(prev => ({...prev, inputEmail: inputEmail, email: `${inputEmail}@${subEmail}`}))
            case "gmail.com" :
                return setNewEmail(prev => ({...prev, inputEmail: inputEmail, email: `${inputEmail}@${subEmail}`}))
            case "daum.net" :
                return setNewEmail(prev => ({...prev, inputEmail: inputEmail, email: `${inputEmail}@${subEmail}`}))
        }
    }

    const changeEmail = () => {
        if(!emailChk) return;

        setUserInfo(prev => ({...prev, email: newEmail.email}));
        setModifyPage(0);
        showToast("변경하신 이메일을 적용합니다. 저장하기를 누르면 정보가 반영됩니다", "success");
    }

    const handelSumbit = async () => {
        if(!userInfo) return;

        try {
            const userPart = {
                userKey: userInfo.userKey,
                username: userInfo.username,
                password: userInfo.password || '',
                useralias: userInfo.useralias,
                email: userInfo.email || '',
                userIntro: userInfo.userIntro || '',
            }

            const formData = new FormData();
            const token = sessionStorage.getItem("token");

            if(userInfo.userimg instanceof File) {
                formData.append("userimg", userInfo.userimg);
            }

            formData.append("user", new Blob([JSON.stringify(userPart)], { type: "application/json" }));

            const response = await postData("/user/modify" , formData , {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            if(response.status === 200) {
                showToast("수정이 완료 되었습니다!", "success");
                navigate(0);
            }
        } catch (err) {
            showToast("통신 장애가 발생했습니다!", "error");
            console.log(err);
        }
    }

    if(!user && !userInfo) return;

    return (
        <>
        <form>
        {!isPassCorrect ?
            <div className="modify-user-wrapper">
                <div className="modify-user-row">
                    <label>비밀번호 : </label>
                    <div className="modify-pass-row">
                        <input 
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => {setPassCorrect(e.target.value)}} 
                            onKeyDown={(e) => {
                            if (e.key === 'Enter') { 
                                e.preventDefault(); 
                                verifyPassword();
                            }}} 
                            value={passCorrect}
                        />
                        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 640 512">
                                {showPassword ?
                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
                                :
                                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>}
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="modify-user-row">
                    <button type="button" className="submit-btn" onClick={verifyPassword}>제출</button>
                </div>
            </div>
            :
            <>
            {modifyPage === 0 ?
                // 기본 정보 입력 창
                <div className="modify-user-wrapper">
                <div className="modify-user-row">
                    <div className="input-box-img">
                        <label htmlFor="userimg">
                            {renderUserImg()}
                        </label>
                        <input id="userimg" type="file" accept="image/*" multiple onChange={handleImgChange} style={{ display: "none"}} />
                    </div>
                </div>
                <div className="modify-user-row">
                    <input type="text" id="userIntro" className="userIntro" onChange={handleInput} value={userInfo.userIntro} placeholder="간단한 소개글을 작성 해보세요!"/>
                </div>
                <div className="modify-user-row">
                    <label>내 가게 이름: </label>
                    <input type="text" id="useralias" className="useralias" onChange={handleInput} value={userInfo.useralias}/>                
                </div>
                <div className="modify-user-row">
                    <label>아이디: </label>
                    <input type="text" id="username" className="username" readOnly onChange={handleInput} value={userInfo.username}/>
                </div>
                <div className="modify-user-row">
                    <label>비밀번호 변경 </label>
                    <input type="text" id="password" className="password" readOnly placeholder={userInfo.password === '' ? "" : "비밀번호 변경됨!"}/>
                    <button type="button" onClick={() => setModifyPage(1)}>변경하기</button>
                </div>
                <div className="modify-user-row">
                    <label>이메일 변경 </label>
                    <input type="text" id="email" className="email" readOnly placeholder={!emailChk ? "" : "이메일 변경됨!"}/>
                    <button type="button" onClick={() => setModifyPage(2)}>변경하기</button>
                </div>
                <div className="modify-user-row">
                    <button type="button" className="submit-btn" onClick={() => setSubmitModal(true)}>저장하기</button>
                </div>
            </div>
            : modifyPage === 1 ?
            // 비밀번호 변경 부분
            <div className="modify-user-wrapper">
                <div className="modify-user-row">
                    <h4>비밀번호 변경</h4>
                </div>
                <div className="modify-user-row">
                    <label>새 비밀번호: </label>
                    <div className="modify-pass-row">
                        <input type={showNewPassword ? "text" : "password"} id="password" autoComplete="off" tabIndex={-1} onChange={handlePassInput} value={newPass.password} />
                        <button type="button" onClick={() => setShowNewPassword(prev => !prev)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 640 512">
                                {showPassword ?
                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
                                :
                                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>}
                            </svg>
                        </button>
                    </div>
                </div>
                {passVerify < 4 &&
                    <span className="password-chk"
                        style={{color: passVerify >= 4 ? "black" :
                                passVerify >= 2 ? "green" : "red"}}>
                        {(newPass.password != null && passVerify >= 4) ?
                        "8~16글자, 대문자, 숫자 특수문자를 최소 한개 포함 해야합니다." 
                        : ((newPass.password != null && passVerify >= 2)) ? "양식이 일치합니다!"
                        : "비밀번호 양식이 올바르지 않습니다!"}
                    </span>
                }
                <div className="modify-user-row">
                    <label>비밀번호 확인: </label>
                    <div className="modify-pass-row">
                        <input type={showNewPasswordChk ? "text" : "password"} id="passwordChk" autoComplete="off" onChange={handlePassInput} value={newPass.passwordChk} />
                        <button type="button" onClick={() => setShowNewPasswordChk(prev => !prev)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 640 512">
                                {showPassword ?
                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
                                :
                                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>}
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="modify-user-row">
                    <button type="button" className="back-btn"  onClick={() => modifyPass(passVerify)}>변경하기</button>
                </div>
                <div className="modify-user-row">
                    <button type="button" className="back-btn"  onClick={() => setModifyPage(0)}>돌아가기</button>
                </div>
            </div>
            :
            // 이메일 변경 란
            <div className="modify-user-wrapper">
            <div className="modify-user-row">
            <h4>이메일 변경</h4>
            </div>
            <div className="modify-user-row">
            <label>이메일: </label>
            <div className="modify-email-input">
                        <input type="text" id="inputEmail" onChange={handleEmailChange} value={newEmail.inputEmail}/>
                        {newEmail.subEmail !== '' && 
                        <p>@</p>
                        }
                        <select onChange={(e) => setNewEmail(prev => ({...prev, subEmail: e.target.value}))}>
                            <option value={""}>직접입력</option>
                            <option value={"naver.com"}>naver.com</option>
                            <option value={"gmail.com"}>gmail.com</option>
                            <option value={"daum.net"}>daum.net</option>
                        </select>
                    </div>
                </div>
                <div className="mail-verify">
                    {!sameEmail ?
                    <MailVerification email={newEmail.email} onVerify={handleEmailVerify} />
                    :
                    <span className="error-email">동일한 이메일 입니다!</span>
                    }
                </div>
                {emailChk &&
                <div className="modify-user-row">
                    <button type="button" className="back-btn" onClick={changeEmail}>변경하기</button>
                </div>
                }
                <div className="modify-user-row">
                    <button type="button" className="back-btn" onClick={() => setModifyPage(0)}>돌아가기</button>
                </div>
            </div> 
            }
            </>
        }
        </form>
        <Modal 
        isOpen={submitModal}
        onClose={() => setSubmitModal(false)}
            onConfirm={handelSumbit}
            title={"회원 정보 변경"}
            message={"입력하신 정보로 회원님의 정보를 변경할까요?"}
            confirmText={"네 바꿔주세요"}
            cancelText={"아직 다 안했어요"}
        />
        </>
    )
}

export default UserModify;