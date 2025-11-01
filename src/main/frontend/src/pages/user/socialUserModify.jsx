import { useNavigate } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import { useCallback, useEffect, useState } from "react";
import { postData } from "../../services/api";
import Modal from "../../util/Modal";
import MailVerification from "../../services/mailVerification";

const SocialUserModify = ({ user }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    // 0 : 기본 창, 1 : 이메일 변경 창
    const [ modifyPage, setModifyPage ] = useState(0);
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

    // 이메일 변경, 확인
    const [ emailChk, setEmailChk ] = useState(false);   // 이메일 인증 확인
    const [ sameEmail, setSameEmail ] = useState(false); // 중복 이메일 방지
    const [ newEmail, setNewEmail ] = useState({
        email: '',
        inputEmail: '',
        subEmail: '',
    });

    // 변경 확인 모달
    const [ submitModal, setSubmitModal ] = useState(false);

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

    const renderUserImg = () => {
        return <img src={modifyImg} alt="유저이미지"/>;
    };

    const handleEmailVerify = useCallback((verified) => {
        setEmailChk(verified);
    }, []);

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
        {modifyPage === 0 ?
        <form>
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
                <input type="text" id="username" className="username" readOnly value={"소셜 아이디로 가입하셨습니다."}/>
            </div>
            {user?.regtype === "N" ?
            <div className="modify-user-row">
                <p style={{margin: "10px auto", fontSize: "9px", textAlign: "center"}}>
                ※네이버 간편 로그인을 이용한 회원분들은 <strong>{"프로필 이미지, 가게 이름, 인삿말"}</strong>만 변경하실 수 있습니다※
                </p>
            </div>
            : user?.regtype === "K" ?
            <>
            <div className="modify-user-row">
                <label>이메일 변경 </label>
                <input type="text" id="email" className="email" readOnly placeholder={!emailChk ? "" : "이메일 변경됨!"}/>
                <button type="button" onClick={() => setModifyPage(1)}>변경하기</button>
            </div>
            <div className="modify-user-row">
                <p style={{margin: "10px auto", fontSize: "9px", textAlign: "center"}}>
                ※카카오 간편 로그인을 이용한 회원분들은 <strong>{"프로필 이미지, 가게 이름, 인삿말, 이메일"}</strong>만 변경하실 수 있습니다※
                </p>
            </div>
            </>
            :
            <></>
            }
            <div className="modify-user-row">
                <button type="button" className="submit-btn" onClick={() => setSubmitModal(true)}>저장하기</button>
            </div>
        </div>
        </form>
        :
        <div className="modify-user-wrapper">
            <div className="modify-user-row">
                <h4>이메일 변경</h4>
            </div>
            <div className="modify-user-row">
                <label>이메일: </label>
                <div className="modify-email-input">
                    <input type="text" id="inputEmail" onChange={handleEmailChange} value={newEmail.inputEmail}/>
                    {newEmail.subEmail !== '' && <p>@</p>}
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
            </div>}
            <div className="modify-user-row">
            <button type="button" className="back-btn" onClick={() => setModifyPage(0)}>돌아가기</button>
            </div>
        </div> 
        }
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

export default SocialUserModify;