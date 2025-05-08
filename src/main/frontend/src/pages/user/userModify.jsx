import { useState } from "react";
import "../../css/pages/userModify.css";
import { useToast } from "../../util/ToastContext";
import Modal from "../../util/Modal";

const UserModify = ({ user, onClose }) => {
    // 0 : 기본 창, 1 : 비밀번호 변경 창, 2: 이메일 변경 창
    const [ modifyPage, setModifyPage ] = useState(0);
    const [ userInfo, setUserInfo ] = useState({    // 유저 정보
        userKey: user.userKey || '',
        username: user.username || '',
        password: '',
        useralias: user.useralias || '',
        email: user.email || '',
        userimg: user.userimg || '',
        userIntro: user.Intro || '',
    });

    // 비밀번호 변경, 확인
    const [ prevPass, setPrevPass ] = useState('');
    const [ passChk, setPassChk ] = useState({
        password: userInfo.password,
        passwordChk: '',
        isSamePass: false,
    });

    // 이메일 변경, 확인
    const [ emailChk, setEmailChk ] = useState({
        email: '',
        address: '',
    });

    const { showToast } = useToast();

    const [ submitModal, setSubmitModal ] = useState(false);

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

        e.target.files = '';
    }

    const renderUserImg = ( img ) => {
        const temp = "/item-images/temp/userImgTemp.png";

        if(!img) return <img src={`http://localhost:8093${temp}`} alt="유저이미지"/>;

        try {
            const previewUrl = URL.createObjectURL(img);
            return <img src={previewUrl} alt="유저이미지" />
        } catch (err) {
            console.error(err);
            return <img src={`http://localhost:8093${temp}`} alt="유저이미지"/>;
        }
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        const subEmail = emailChk.address;

        switch (subEmail) {
            case "" :
                return setUserInfo(prev => ({...prev, email: email}));
            case "naver.com" :
                return setUserInfo(prev => ({...prev, email: `${email}@${subEmail}`}))
            case "gmail.com" :
                return setUserInfo(prev => ({...prev, email: `${email}@${subEmail}`}))
            case "daum.net" :
                return setUserInfo(prev => ({...prev, email: `${email}@${subEmail}`}))
        }
    }

    const handelSumbit = () => {

    }

    if(!user && !userInfo) return;

    return (
        <>
        <form>
            {modifyPage === 0 ?
            // 기본 정보 입력 창
            <div className="modify-user-wrapper">
                <div className="modify-user-row">
                    <div className="input-box-img">
                        <label htmlFor="userimg">
                            {renderUserImg(userInfo.userimg)}
                        </label>
                        <input id="userimg" type="file" accept="image/*" multiple onChange={handleImgChange} style={{ display: "none"}} />
                    </div>
                </div>
                <div className="modify-user-row">
                    <input type="text" id="userIntro" onChange={handleInput} value={userInfo.userIntro} placeholder="간단한 소개글을 작성 해보세요!"/>
                </div>
                <div className="modify-user-row">
                    <label>내 가게 이름: </label>
                    <input type="text" id="useralias" onChange={handleInput} value={userInfo.useralias}/>                
                </div>
                <div className="modify-user-row">
                    <label>아이디: </label>
                    <input type="text" id="username" readOnly onChange={handleInput} value={userInfo.username}/>
                </div>
                <div className="modify-user-row">
                    <label>비밀번호 변경 </label>
                    <button type="button" onClick={() => setModifyPage(1)}>변경하기</button>
                </div>
                <div className="modify-user-row">
                    <label>이메일 변경 </label>
                    <button type="button" onClick={() => setModifyPage(2)}>변경하기</button>
                </div>
                <div className="modify-user-row">
                    <button type="button" id="submit-btn" onClick={() => setSubmitModal(true)}>저장하기</button>
                </div>
            </div>
            : modifyPage === 1 ?
            // 비밀번호 변경 부분
            <div className="modify-user-wrapper">
                <div className="modify-user-row">
                    <h4>비밀번호 변경</h4>
                </div>
                <div className="modify-user-row">
                    <label>이전 비밀번호: </label>
                    <input type="text" id="prevPass" onChange={handleInput} value={prevPass}/>
                </div>
                <div className="modify-user-row">
                    <label>비밀번호: </label>
                    <input type="text" id="password" onChange={handleInput} value={passChk.password}/>
                </div>
                <div className="modify-user-row">
                    <label>비밀번호 확인: </label>
                    <input type="text" id="passwordChk" onChange={handleInput} value={passChk.passwordChk}/>
                </div>
                <div className="modify-user-row">
                <button type="button" id="back-btn" onClick={() => setModifyPage(0)}>돌아가기</button>
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
                        <input type="text" id="email" onChange={handleEmailChange} value={userInfo.email}/>
                        {emailChk.address !== '' && 
                        <p>@</p>
                        }
                        <select onChange={(e) => setEmailChk(prev => ({...prev, address: e.target.value}))}>
                            <option value={""}>직접입력</option>
                            <option value={"naver.com"}>naver.com</option>
                            <option value={"gmail.com"}>gmail.com</option>
                            <option value={"daum.net"}>daum.net</option>
                        </select>
                    </div>
                </div>
                <div className="modify-user-row">

                </div>
                <div className="modify-user-row">
                    <button type="button" id="back-btn" onClick={() => setModifyPage(0)}>돌아가기</button>
                </div>
            </div> 
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