import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "../../services/api";
import { useToast } from "../../components/ToastContext";
import "../../components/css/itemDetail.css";

const ItemDetail = () => {
    // URL의 아이템키 받아오기
    const { itemKey } = useParams();

    // Item's Info
    const [ item, setItem ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    // Seller's Item
    const [ sellerItem, setSellerItem ] = useState(null);

    // Like Toggle
    const [ isItemLike, setIsItemLike ] = useState(false);

    // Utils
    const { showToast } = useToast();
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await getData(`/product/${itemKey}`, { withCredentials: true });
                setItem(response.data);
            } catch (err) {
                showToast("통신 장애로 상품을 가져오지 못했어요...", "error");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if(itemKey) {
            fetchItem();
        }
    }, [itemKey]);

    useEffect(() => {
        const fetchSellerItem = async () => {

        }
    })

    const renderImage = ( imgs ) => {
        const mainImage = imgs.find(img => img.main);
        const images = mainImage ? [mainImage, ...imgs.filter(img => img !== mainImage)] : [...imgs];
        

        if(imgs.length <= 0) {
            const temp = "/item-images/temp/SStemp.png";
            return <img
                    src={`http://localhost:8093${temp}`}
                    alt="상품이미지"/>;
        }

        if(imgs.length > 1) {
            return (
                <>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={`http://localhost:8093${img.imgUrl}`}
                            alt="상품이미지"
                        />
                    ))}
                </>
            );
        }

        return (
            <img
                src={`http://localhost:8093${images[0].imgUrl}`}
                alt="상품이미지"
            />
        )
    }

    const renderLocations = ( locs ) => {
        const locations = locs.map((loc) => loc.placeName);

        if(locations.length <= 0) return;

        if(locations.length > 1) {
            return (
            <>
                {locations.map((loc, index) => <p key={index}>🚩 {loc}</p>)}
            </>
            );
        }

        return (
            <p>🚩 {locations}</p>
        )
    }

    const toggleItemLike = () => {
        setIsItemLike(prev => !prev);

        // 누르면 서버에 like 생성, 한번 더 누르면 모달 띄우고 확인하면 제거

    }

    if (loading) return <div>상품을 가져오고 있어요!</div>;
    if (!item) return <div>어라..? 상품을 찾을 수 없어요..!</div>;

    return (
        <>
        <main>
            <div className="item-wrapper">
                <div className="item-row">
                    {/* 상품 이미지 */}
                    <div className="item-Image">
                        {renderImage(item.images)}
                    </div>
                    {/* 상품 정보 */}
                    <div className="item-Info">
                        <div className="item-label">
                            {/* 카테고리 정렬란 */}
                            <a href="/">
                                카테고리 표시용
                            </a>
                            {/* 제목 */}
                            <label>{item.subject}</label>
                            {/* 가격 */}
                            <label>
                                {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                            </label>

                            {/* 몇분전, 조회, 채팅방 수, 찜 수 */}
                            <p>{getDayMinuteCounter(item.writeDate)} | 조회 {item.viewcnt} | 채팅 {0} | 찜 {0}</p>

                        </div>
                        <div className="item-status-box">
                            <div className="item-status">
                                <label>제품 상황</label>
                                <p>{item.tradestatus ? "거래 완료" : "거래 중"}</p>
                            </div>
                            <a>|</a>
                            <div className="item-status">
                                <label>제품 상태</label>
                                <p>{item.itemtype === "NEW" ? "신품" : "중고"}</p>
                            </div>
                            <a>|</a>
                            <div className="item-status">
                                <label>거래 방식</label>
                                <p>{item.purtype === 3 ? "둘다 가능" :
                                    item.purtype === 2 ? "직거래" : "택배"}</p>
                            </div>
                        </div>
                        <div className="item-location">
                            <label>- 희망거래지역</label>
                            {renderLocations(item.locations)}
                        </div>
                        <div className="item-Btns">
                            <button type="button" onClick={toggleItemLike}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="35" width="35" viewBox="0 0 512 512">
                                    {isItemLike ?
                                    <path fill="#FFD43B" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                                    : <path fill="#FFD43B" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                                    }
                                </svg>
                                

                            </button>
                            <button type="button" className="item-chat-btn">채팅하기</button>
                            <button type="button" className="item-purchase-btn">구매하기</button>
                        </div>
                    </div>
                </div>
                <div className="item-row">
                    <div className="item-subInfo">
                        <div className="item-content-box">
                            <label>상품정보</label>
                            <div className="item-content">
                                {item.content}
                            </div>
                        </div>
                        <div className="item-seller-box">
                            <label>판매자 정보</label>
                            <div className="item-seller">
                                <p onClick={() => navigate(`/user/${item.userKey}`)}>{item.useralias}</p>
                                <img onClick={() => navigate(`/user/${item.userKey}`)} src={`http://localhost:8093/item-images/temp/userImgTemp.png`}/>
                            </div>
                            <div className="item-seller-product">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

// 상품이 등록된지 얼마나 되었는지 표시
const getDayMinuteCounter = (date) => {
    if (!date) {return "";}

    let today = new Date();
    let postdate = new Date(date);
    let elapsedTime = Math.trunc((today - postdate) / 1000);
    let elapsedText = "";

    const seconds = 1;
    const minute = seconds * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if(elapsedTime < seconds) {
        elapsedText = "방금전";
    } else if (elapsedTime < minute) {
        elapsedText = elapsedTime + "초 전";
    } else if (elapsedTime < hour) {
        elapsedText = Math.trunc(elapsedTime / minute) + "분 전";
    } else if (elapsedTime < day) {
        elapsedText = Math.trunc(elapsedTime / hour) + "시간간 전";
    } else if (elapsedTime < (day * 15)) {
        elapsedText = Math.trunc(elapsedTime / day) + "분 전";
    } else {
        elapsedText = postdate.toLocaleDateString("ko-KR", {dateStyle: "medium",})
    }

    return elapsedText;
}

export default ItemDetail;