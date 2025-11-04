import { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";
import { getData } from "../../services/api";
import '../../css/side/userside.css';
import { useNavigate } from "react-router-dom";


const UserSidePage = ({ isOpen, onClose, logout }) => {

    const { user, loading } = useUser();

    const [ unReadCount, setUnReadCount ] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getUnReadCount = async () => {
            const response = await getData("/chat/rooms");
            if(response.status === 200) {
                const { unReadCounts } = response.data;
                setUnReadCount(unReadCounts);
            }
        };
        getUnReadCount();
    }, []);

    const handleLogout = () => {
        logout();
        onClose();
    }

    if(loading || !logout) return null;

    return (
        <>
        <div className="userside-sidebar">
            {/* 유저 정보칸 : 가입유형 + 프로필 사진 */}
            <div className="userside-box">
                <div className="userside-userinfo">
                    <label className="userside-userinfo-useralias">
                        {user.useralias}
                    </label>
                    <label className="userside-userinfo-regtype">
                        {user.regtype === "G" ? "Google과 함께 오셧군요? 환영해요!" 
                        : user.regtype === "N" ? "Naver와 함께 오셧군요? 반가워요!"
                        : user.regtype === "K" ? "Kakao와 함께 오셧군요? 어서오세요!"
                        : "ShareSite와 함께하고 계십니다!" 
                    }
                    </label>
                </div>
                <img src={user ?
                `http://localhost:5178${user.userimg}`
                :
                `http://localhost:5178/uploads/temp/userImgTemp.png`} />
            </div>

            {/* 마이페이지 이동 버튼 */}
            <div className="userside-mypage" onClick={() => navigate(`/user/${user?.userKey}`)}>
                <label>마이페이지</label>
            </div>

            {/* 신규 채팅 알림 */}
            <div className="userside-alert">
                <p></p>
            </div>

            {/* 신규 거래 알림 */}
            <div className="userside-alert">

            </div>

            {/* 로그아웃 버튼 (가장 아래) */}
            <div className="userside-logout" onClick={handleLogout}>
                <label>로그아웃</label>
            </div>
        </div>
        </>
    );
}

export default UserSidePage;