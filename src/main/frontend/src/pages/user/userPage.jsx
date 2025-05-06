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

    // 유저페이지 정보들
    const [ userInfo, setUserInfo ] = useState(null);
    const [ userItem, setUserItem ] = useState(null);
    const [ trading, setTranding ] = useState(null);
    const [ traded, setTranded ] = useState(null);
    const [ sortedItem, setSortedItem ] = useState(null);

    // 상품 정렬 기준
    const [ sortTrade, setSortTrade ] = useState("ALL");
    const [ sortOption, setSortOption ] = useState("recent");

    const logginUserKey = user !== null ? user.userKey : null;
    const isOwnPage = userKey === logginUserKey;

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await getData(`/user/${userKey}`);
                const { userInfo, userItems } = response.data;      
                setUserInfo(userInfo);
                setUserItem(userItems);

                if(userItems != null) {
                    setTranding(userItems.filter(item => item.tradestatus === false));
                    setTranded(userItems.filter(item => item.tradestatus === true));
                };
            } catch (err) {
                showToast("통신 에러가 발생했습니다..", "error");
                console.log(err);
            }
        }
        getUserInfo();
    }, [userKey]);

    // const sortUserItem = () => {
    //     switch (sortTrade) {
    //         case "ALL" :
    //             return setSortedItem(userItem);
    //         case "TRADING" :
    //             return setSortedItem(trading);
    //         case "TRADED" :
    //             return setSortedItem(traded);
    //         default :
    //             return 0;
    //     }
    // }

    // const fetchSortedItem = [...sortedItem].sort((a, b) => {
    //     switch (sortOption) {
    //         case "recent" :
    //             return new Date(b.writeDate) - new Date(a.writeDate);
    //         case "price-asc" :
    //             return a.price - b.price;
    //         case "price-desc" :
    //             return b.price - a.price;
    //         default:
    //             return 0;
    //     }
    // });

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
                                <div className="trade-status-box">
                                    <label>거래 중 상품</label>
                                    <p>{trading ? trading.length : "0"}</p>
                                </div>
                                <a>|</a>
                                <div className="trade-status-box">
                                    <label>거래완료</label>
                                    <p>{traded ? traded.length : "0"}</p>
                                </div>
                                <a>|</a>
                                <div className="trade-status-box">
                                    <label>거래리뷰</label>
                                    <p style={{textDecoration: "underline", cursor: "pointer"}}
                                        onClick={null}>
                                        {1}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="user-page-row">
                            <div className="user-info">
                                <div className="user-score"></div>
                                <img className="user-img">
                                    {}
                                </img>
                            </div>
                            <div className="user-info-status">
                                <div>
                                    <label>
                                        {isOwnPage ?
                                        "상품 등록하기"
                                        :
                                        `'${userInfo.useralias}'님과 채팅하기`
                                        }
                                    </label>
                                    <p>
                                        {isOwnPage ?
                                        "더 많은 상품을 다른 분들과 거래해보세요!"
                                        :
                                        "상품에 대해 더 자세히 알고 싶으시다면?"
                                        }
                                    </p>
                                </div>
                                <button >
                                    {isOwnPage ?
                                    "등록하기"
                                    :
                                    "채팅하기"
                                    }
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="user-item-box">
                        <label>유저 상품</label>
                        <div className="user-item-type">
                            <button
                                className={sortTrade === "ALL" ? "sort-button-selected" : "sort-button"}
                                onClick={() => setSortTrade("ALL")}
                            >
                                전체
                            </button>
                            <button
                                className={sortTrade === "TRADING" ? "sort-button-selected" : "sort-button"}
                                onClick={() => setSortTrade("TRADING")}
                            >
                                거래중
                            </button>
                            <button
                                className={sortTrade === "TRADED" ? "sort-button-selected" : "sort-button"}
                                onClick={() => setSortTrade("TRADED")}
                            >
                                거래완료
                            </button>
                        </div>
                        <div className="user-item-sort">
                            <label>총 {userItem.length} 개</label>
                            <div className="item-result-sort">
                                <button 
                                    onClick={() => setSortOption("recent")}
                                    className={sortOption === "recent" ? "sort-button-selected" : "sort-botton"}
                                >최신순</button>
                                <p> / </p>
                                <button 
                                    onClick={() => setSortOption("price-desc")}
                                    className={sortOption === "price-desc" ? "sort-button-selected" : "sort-botton"}
                                >높은가격순</button>
                                <p> / </p>
                                <button 
                                    onClick={() => setSortOption("price-asc")}
                                    className={sortOption === "price-asc" ? "sort-button-selected" : "sort-botton"}
                                >낮은가격순</button>
                            </div>
                        </div>
                        <div className="user-item-result">
                            
                        </div>
                    </div>
                </div>
            </div>
            {/* 사이드 페이지 부분 */}
        </main>
        </>
    )
};

export default UserPage;

