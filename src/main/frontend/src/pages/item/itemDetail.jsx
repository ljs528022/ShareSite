import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../../services/api";
import { useToast } from "../../components/ToastContext";
import "../../components/css/itemDetail.css";

const ItemDetail = () => {
    // URL의 아이템키 받아오기
    const { itemKey } = useParams();

    // Item's Info
    const [ item, setItem ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    // Toast
    const { showToast } = useToast();
 
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

    console.log(item);

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
                            
                        </div>
                        <div className="item-Btns">

                        </div>
                    </div>
                </div>
                <div className="item-row">
                    <div className="item-subInfo">
                        <div className="item-content">

                        </div>
                        <div className="item-seller">

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