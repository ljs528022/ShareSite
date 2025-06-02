import { useEffect, useRef, useState } from "react";
import { useUser } from "../../services/UserContext";
import { getData } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import ItemCard from "../../components/itemCard";
import EmptyBox from "../../components/EmptyBox";
import SidePage from "../../util/sidePage";
import LikeShow from "../side/LikeShow";
import UserModify from "./userModify";
import EditModal from "../../util/EditModal";
import LocationList from "../side/LocationList";
import Payments from "../side/Payments";
import Modal from "../../util/Modal";
import WriteReview from "../side/WriteReview";
import Reviews from "../side/Reviews";
import ChatRoom from "../../services/ChatRoom";
import "../../css/pages/userPage.css";

const UserPage = () => {

    const { userKey } = useParams();
    const { user } = useUser();

    const { showToast } = useToast();
    const navigate = useNavigate();

    // 유저페이지 정보들
    const [ userInfo, setUserInfo ] = useState(null);
    const [ userItem, setUserItem ] = useState(null);
    const [ trading, setTrading ] = useState(null);
    const [ traded, setTraded ] = useState(null);

    // 거래 리뷰의 판매자 정보
    const reviewRef = useRef(null);
    // 해당 유저 페이지의 거래 후기
    const [ userReivew, setUserReview ] = useState(null);

    // 상품 정렬 기준
    const [ sortTrade, setSortTrade ] = useState("ALL");
    const [ sortOption, setSortOption ] = useState("recent");

    // 유저 신뢰도 -> 거래 리뷰의 좋아요, 싫어요에 따라 점수가 변동하는 값임
    const [ userScore, setUserScore ] = useState(0);

    // 사이드 페이지 & 모달 ON | OFF
    const [ showPayment, setShowPayment ] = useState(false);            // 구매 내역
    const [ showLikeItem, setShowLikeItem ] = useState(false);          // 찜한 상품
    const [ showModify, setShowModify] = useState(false);               // 내 정보 수정
    const [ showLocation, setShowLocation ] = useState(false);          // 배송지 관리
    const [ showReivewModal, setShowReviewModal ] = useState(false);    // 리뷰 남기기 확인 모달
    const [ writeReview, setWriteReview ] = useState(false);            // 리뷰 남기기
    const [ showReviews, setShowReviews ] = useState(false);            // 거래 리뷰
    const [ showChat, setShowChat ] = useState(false);                  // 채팅하기

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
                    setTrading(userItems.filter(item => item.tradestatus === false));
                    setTraded(userItems.filter(item => item.tradestatus === true));
                };
            } catch (err) {
                showToast("통신 에러가 발생했습니다..", "error");
                console.log(err);
            }
        }
        getUserInfo();
    }, [userKey]);

    // 해당 유저의 거래 리뷰 받아오기
    useEffect(() => {
        const getReview = async () => {
            try {
                const response = await getData(`/api/review/${userKey}`);
                if(response.status === 200) {
                    setUserReview(response.data);
                }
            } catch {
                showToast("통신 에러가 발생했습니다..", "error");
            }
        }
        getReview();
    }, [userKey]);

    const getsortedItems = () => {
        if(!userItem) return;

        let baseList = [];
        if(sortTrade === "ALL") baseList = userItem || [];
        else if (sortTrade === "TRADING") baseList = trading || [];
        else if (sortTrade === "TRADED") baseList = traded || [];

        const sorted = [...baseList].sort((a, b) => {
            switch (sortOption) {
                case "recent" :
                    return new Date(b.writeDate) - new Date(a.writeDate);
                case "price-asc" :
                    return a.price - b.price;
                case "price-desc" :
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

        return sorted;
    };

    const handleShowReview = (sellerInfo) => {
        reviewRef.current = sellerInfo;
        setShowReviewModal(true);
    }

    const displayedItems = getsortedItems();

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
                            <li onClick={() => setShowPayment(true)}>
                                구매 내역
                            </li>
                            <li onClick={() => setShowLikeItem(true)}>
                                찜한 상품
                            </li>
                        </ul>
                    </div>
                    <div className="user-mypage-row">
                        <label>내 정보</label>
                        <ul>
                            <li onClick={() => setShowModify(true)}>
                                내 정보 수정
                            </li>
                            <li onClick={() => showToast("준비 중인 서비스입니다. 빠른 시일 내에 제공해드릴게요!", "warning")}>
                                계좌 관리
                            </li>
                            <li onClick={() => setShowLocation(prev => !prev)}>
                                배송지 관리
                            </li>
                            <li onClick={() => setShowReviews(true)}>
                                거래 후기
                            </li>
                            <li onClick={() => showToast("작성 예정!")}>
                                탈퇴하기
                            </li>
                        </ul>
                    </div>
                </div>
                }
                {/* 유저 정보 표시 부분 */}
                <div className="user-page-box">
                    <div className="user-info-box">
                        <div className="user-page-row">
                            {/* 유저 이름 */}
                            <label>{userInfo.useralias}#{userInfo.userKey}</label>
                            <p className="user-decoration">
                                
                                {userInfo.userIntro ? userInfo.userIntro : "더 다양한 상품을 다른 회원들과 거래 해보세요!"}
                            </p>
                            {/* 유저의 상품 거래 현황 */}
                            <div className="user-trade-status">
                                <div className="trade-status-box">
                                    <label>거래 중 상품</label>
                                    <p>{trading ? trading.length : "0"}</p>
                                </div>
                                <a>|</a>
                                <div className="trade-status-box">
                                    <label>거래 완료</label>
                                    <p>{traded ? traded.length : "0"}</p>
                                </div>
                                <a>|</a>
                                <div className="trade-status-box">
                                    <label>거래 리뷰</label>
                                    <p style={{textDecoration: "underline", cursor: "pointer"}}
                                        onClick={() => setShowReviews(true)}>
                                        {userReivew ? userReivew.length : "0"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* 유저 신뢰도 & 유저 이미지 & 채팅 or 상품 등록 버튼 부분 */}
                        <div className="user-page-row">
                            <div className="user-info">
                                {/* 유저 신뢰도 나중에 기능 추가해야 함 */}
                                <div className="user-score">
                                    <label>유저 신뢰도 : {userScore}</label>
                                    <div className="user-score-bar" />
                                </div>
                                <img 
                                    className="user-img"
                                    src={userInfo.userimg !== '' ? `http://localhost:8093${userInfo.userimg}` : 'http://localhost:8093/item-images/temp/userImgTemp.png'}
                                />
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
                                
                                <button onClick={isOwnPage ? () => navigate("/product/write") : () => setShowChat(true)}>
                                    {isOwnPage ?
                                    "등록하기"
                                    :
                                    "채팅하기"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* 해당 유저의 상품 표시 부분 */}
                    <div className="user-item-box">
                        <label>유저 상품</label>
                        <div className="user-item-type">
                            <button
                                className={sortTrade === "ALL" ? "sort-button-selected" : "sort-button"}
                                onClick={() => setSortTrade("ALL")}>
                                전체
                            </button>
                            <button
                                className={sortTrade === "TRADING" ? "sort-button-selected" : "sort-button"}
                                onClick={() => setSortTrade("TRADING")}>
                                거래중
                            </button>
                            <button
                                className={sortTrade === "TRADED" ? "sort-button-selected" : "sort-button"}
                                onClick={() => setSortTrade("TRADED")}>
                                거래완료
                            </button>
                        </div>
                        <div className="user-item-sort">
                            <label>총 {
                                sortTrade === "ALL" ? 
                                `${userItem.length !== undefined ? userItem.length : 0}` 
                                : sortTrade === "TRADING" ?
                                `${trading.length !== undefined ? trading.length : 0}`
                                :
                                `${traded.length !== undefined ? traded.length : 0}`
                            } 개</label>
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
                            {displayedItems.length > 0 ?
                            displayedItems.map(item => (
                                <ItemCard key={item.itemKey} item={item} style={"Normal"} />
                            ))
                            :
                            <EmptyBox content={"관련된 상품이 없습니다.. 나중에 다시 확인해주세요!"} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* 사이드 페이지 부분 */}
            {/* 구매 내역  */}
            <SidePage
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                headerText={"내가 거래한 상품"}
                content={<Payments setShowReview={handleShowReview} />}
            />

            {/* 리뷰 남기기 확인 Modal */}
            <Modal
                isOpen={showReivewModal}
                onClose={() => setShowReviewModal(false)}
                onConfirm={() => {
                    setShowReviewModal(false);
                    setWriteReview(true);}}
                title={"리뷰 남기기"}
                message={`상품을 구매해주셔서 감사합니다!\n지금 판매자에 대한 거래 리뷰를 남기시겠어요?\n
                    거래 리뷰를 남기면 판매자의 상품을 구매하는 \n다른 회원분들에게 큰 도움이 됩니다!`}
                confirmText={"네, 지금 쓸게요"}
                cancelText={"아뇨, 나중에 쓸게요"}
            />

            {/* 리뷰 남기기 EditModal */}
            <EditModal
                isOpen={writeReview}
                onClose={() => setWriteReview(false)}
                title={""}
                content={<WriteReview sellerInfo={reviewRef.current} onClose={() => setWriteReview(false)} />}
            />
            
            {/* 찜한 상품 */}
            <SidePage 
                isOpen={showLikeItem} 
                onClose={() => setShowLikeItem(false)}
                headerText={"내가 찜한 상품"}
                content={<LikeShow isOpen={showLikeItem} data={userKey} />}
            />

            {/* 내 정보 수정 */}
            <EditModal 
                isOpen={showModify}
                onClose={() => setShowModify(false)}
                title={"내 정보 수정"}
                content={<UserModify user={userInfo} onClose={() => setShowModify(false)}/>}
            />

            {/* 계좌 관리 */}
            

            {/* 배송지 관리 */}
            <SidePage 
                isOpen={showLocation}
                onClose={() => setShowLocation(false)}
                headerText={"배송지 관리"}
                content={<LocationList />}
            />

            {/* 거래 후기 */}
            <SidePage
                isOpen={showReviews}
                onClose={() => setShowReviews(false)}
                headerText={"거래 리뷰"}
                content={<Reviews reviews={userReivew} />}
            />

            {/* 채팅하기 */}
            <SidePage
                isOpen={showChat}
                onClose={() => setShowChat(false)}
                headerText={"채팅하기"}
                content={
                <ChatRoom
                    senderKey={user.userKey}
                    receiverKey={userKey}
                />
                }
            />


            {/* 탈퇴하기 */}

        </main>
        </>
    )
};

export default UserPage;

