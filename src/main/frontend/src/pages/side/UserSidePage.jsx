import { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";
import { getData } from "../../services/api";
import '../../css/side/userside.css';


const UserSidePage = ({ isOpen, logout }) => {

    const { user, loading } = useUser();

    const [ unReadCount, setUnReadCount ] = useState(null);

    const { showToast } = useToast();

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

    if(loading || !logout) return null;

    return (
        <>
        <div className="userside-box">
            {/* 유저 정보칸 : 가입유형 + 프로필 사진 */}
            <div className="userside-userinfo">
                <label className="userside-userinfo-useralias">
                    {user.useralias}
                </label>
                <label className="userside-userinfo-regtype">
                    {/* {user.regtype === "G" ? "Google과 함께 오셧군요? 환영해요!" 
                    : user.regtype === "N" ? "Naver와 함께 오셧군요? 반가워요!"
                    : user.regtype === "K" ? "Kakao와 함께 오셧군요? 어서오세요!"
                    : "ShareSite와 함께하고 계십니다!" 
                    } */}
                </label>
            </div>

            {/* 마이페이지 이동 버튼 */}
            <div className="userside-button">
                <button></button>
            </div>

            {/* 신규 채팅 알림 */}
            <div className="userside-alert">
                <p></p>
            </div>

            {/* 신규 거래 알림 */}
            <div className="userside-alert">

            </div>

            {/* 로그아웃 버튼 (가장 아래) */}
            <div className="userside-logout">

            </div>
        </div>
        </>
    );
}

export default UserSidePage;