import { useState } from "react";
import "../../css/pages/userModify.css";

const UserModify = ({ user, onClose }) => {

    const [ modifyPass, swtModifyPass ] = useState(false);

    return (
        <>
        <form>
            <div className="modify-user-wrapper">
                <div className="modify-user-row">
                    <img></img>
                    <div className="img-input">
                        <input type="file"/>
                    </div>
                </div>
                <div className="modify-user-row">
                    <label>내 가게 이름: </label>
                    <div className="alias-input">
                        <input type="text" value={user.useralias}/>
                    </div>                        
                </div>
                <div className="modify-user-row">
                    <label>아이디: </label>
                    <input type="text" disabled value={user.username}/>
                </div>
                <div className="modify-user-row">
                    <label>비밀번호: </label>
                    <input type="text" className="pass-input"/>
                </div>
                <div className="modify-user-row">
                    <label>이메일: </label>
                    <input type="text" value={user.email}/>
                </div>
            </div>
        </form>
        </>
    )
}

export default UserModify;