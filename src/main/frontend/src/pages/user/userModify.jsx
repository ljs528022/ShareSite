import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import { postData } from "../../services/api";
import MailVerification from "../../services/mailVerification";
import Modal from "../../util/Modal";
import "../../css/pages/userModify.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

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
            setModifyImg("http://localhost:5178/uploads/item-images/temp/userImgTemp.png");
        } else if(typeof userInfo.userimg === "string" && userInfo.userimg.includes("/user-images")) {
            setModifyImg(`http://localhost:5178${userInfo.userimg}`);
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
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");

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
                        {showPassword ?
                            <FaRegEyeSlash size={20} color="black"/>
                            :
                            <FaRegEye size={20} color="black"/>
                        }
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
                            {showNewPassword ?
                            <FaRegEyeSlash size={20} color="black"/>
                            :
                            <FaRegEye size={20} color="black"/>
                            }
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
                            {showNewPasswordChk ?
                            <FaRegEyeSlash size={20} color="black"/>
                            :
                            <FaRegEye size={20} color="black"/>
                            }
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
                    <MailVerification email={newEmail.email} onVerify={handleEmailVerify} style={"mail-verify-"}/>
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