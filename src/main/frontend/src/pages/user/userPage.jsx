import { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import { getData } from "../../services/api";
import { useParams } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import "../../components/css/userPage.css";

const UserPage = () => {

    const { userKey } = useParams();
    const { user } = useUser();

    const { showToast } = useToast();

    const [ userInfo, setUserInfo ] = useState(null);
    const [ userItem, setUserItem ] = useState(null);
    const logginUserKey = user !== null ? user.userKey : null;
    
    const isOwnPage = userKey === logginUserKey;

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await getData(`/user/${userKey}`);   
                console.log(userKey);             
                setUserInfo(response.data);
                console.log(response.data);
            } catch (err) {
                showToast("통신 에러가 발생했습니다..", "error");
                console.log(err);
            }
        }
        getUserInfo();
    }, [userKey]);

    if(!userInfo) return;

    return (
        <>
        <main>
            {/* 유저페이지가 로그인한 유저와 같을 경우 표시 */}
            <div className="user-page-wrapper">
                {isOwnPage &&
                <div className="user-mypage-box">
                    {/* 마이페이지 부분 -> onClick 만들어야 함 */}
                    <label>마이페이지</label>
                    <div className="user-mypage-row">
                        <label>거래정보</label>
                        <ul>
                            <li>판매 내역</li>
                            <li>구매 내역</li>
                            <li>찜한 상품</li>
                        </ul>
                    </div>
                    <div className="user-mypage-row">
                        <label>내 정보</label>
                        <ul>
                            <li>내 정보 수정</li>
                            <li>계좌 관리</li>
                            <li>배송지 관리</li>
                            <li>거래 후기</li>
                            <li>탈퇴하기</li>
                        </ul>
                    </div>
                </div>
                }
                <div className="user-page-box">
                    <div className="user-info-box">
                        <div className="user-page-row">
                            <label>{userInfo.useralias}#{userInfo.userKey}</label>
                            <p className="user-decoration">
                                더 다양한 상품을 다른 회원들과 거래 해보세요!
                            </p>
                            <div className="user-trade-status">

                            </div>
                        </div>
                        <div className="user-page-row">
                            <div className="user-img">
                                <a></a>
                                <img></img>
                            </div>
                            <div className="user-trade-status">
                                <div>
                                    <p></p>
                                    <p></p>
                                </div>
                                <button>등록하기</button>
                            </div>

                        </div>
                    </div>
                    <div className="user-item-box">
                        <label>유저 상품</label>
                    </div>
                </div>
            </div>
            {/* 사이드 페이지 부분 */}
        </main>
        </>
    )
};

export default UserPage;

