import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../services/api";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";
import { getCategory } from "../../services/getCategory";
import { Viewer } from "@toast-ui/react-editor";
import Pagination from "../../util/Pagination";
import ItemCardList from "../../components/itemCardList";
import LikeButton from "../../util/LikeButton";
import Modal from "../../util/Modal";
import SidePage from "../../util/sidePage";
import MapShow from "../../pages/side/MapShow";
import EmptyBox from "../../components/EmptyBox";
import "../../css/pages/itemDetail.css";

const ItemDetail = () => {
    // URL의 아이템키 받아오기
    const { itemKey } = useParams();
    const { user } = useUser();  // 상품이 로그인한 유저의 것인지 판별용
    const userKey = user !== null ? user.userKey : null;

    // Item's Info
    const [ item, setItem ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ showDelete, setShowDelete ] = useState(false);
    
    // Item's Category
    const [ cate, setCate ] = useState([]);
    const parentKey = Math.floor(item.cateKey / 100) * 100;
    const parentCate = cate.find(c => c.cateKey === parentKey);
    const currentCate = cate.find(c => c.cateKey === item.cateKey);

    // Image Pagination
    const [ currentPage, setCurrentPage ] = useState(1);

    // Seller's Items
    const [ sellerItem, setSellerItem ] = useState([]);

    // Same Category's Items
    const [ itemsSameCate, setItemsSameCate ] = useState([]);

    // Item's Likes
    const [ itemsLike, setitemLike ] = useState(0);

    // Utils
    const [ showMap, setShowMap ] = useState(false);    // 지도 창
    const [ sideMapLocation, setSideMapLocation ] = useState(''); // 지도 창 정보
    const { showToast } = useToast();
    const navigate = useNavigate();
    
 
    // 해당 상품의 정보 받아오기
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

    // 판매자가 판매 중인 다른 상품 불러오기
    useEffect(() => {
        if(item.userKey === undefined) return;

        const getOtherItems = async () => {
            try {
                const response = await getData(`/product/seller/${item.userKey}`, { withCredentials: true });
                setSellerItem(response.data.sellerItems.filter(items => items.itemKey != itemKey));
            } catch (err) {
                console.log("Failed Load Data...", err);
            }
        }

        getOtherItems();
    }, [item.itemKey, item.userKey]);

    // 연관된 카테고리 상품들 받아오기
    useEffect(() => {
        if(item.cateKey === undefined) return;

        const getItemsSameCateKey = async () => {
            try {
                const response = await getData(`/product/cate/${item.cateKey}`, { withCredentials: true });
                setItemsSameCate(response.data.sameCateItems.filter(items => items.itemKey != itemKey));
            } catch (err) {
                console.log("Failed Load Data...", err);
            }
        }

        getItemsSameCateKey();
    }, [item.cateKey]);

    // 카테고리 받아오기
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await getCategory();
            setCate(data);
        };
    
        fetchCategories();
    }, [])

    // 해당 상품의 찜 개수 받아오기
    useEffect(() => {
        if(!itemKey) return;

        const getItemsLike = async () => {
            const response = await getData(`/like/${itemKey}`, { withCredentials: true });
            if(response.data > 0) {
                setitemLike(response.data);
            } else {
                setitemLike(0);
            }
        }
        getItemsLike();
    }, [itemKey]);

    const renderImage = ( imgs ) => {
        const mainImage = imgs.find(img => img.main);
        const images = mainImage ? [mainImage, ...imgs.filter(img => img !== mainImage)] : [...imgs];
        
        const totalPage = images.length;
        const startIndex = currentPage - 1;
        const currentImg = images.slice(startIndex, startIndex + 1);

        const handlePageChange = (page) => {
            if(page < 1 || page > totalPage) return;
            setCurrentPage(page);
        }


        if(!imgs || imgs.length === 0) {
            const temp = "/item-images/temp/SStemp.png";
            return <img
                    src={`http://localhost:8093${temp}`}
                    alt="상품이미지"/>
        }

        if(imgs.length > 1) {
            return (
                <>
                    {currentImg.map((img, index) => (
                        <img
                            key={index}
                            src={`http://localhost:8093${img.imgUrl}`}
                            alt="상품이미지"
                        />
                    ))}
                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        style={"img_"}
                    />
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

    const handleMapOpen = (loc) => {
        if(!loc) return;

        setSideMapLocation(loc);
        setShowMap(true);
    }

    const renderLocations = ( locs ) => {
        const locations = locs.map((loc) => loc.address);

        if(locations.length <= 0) return;

        if(locations.length > 1) {
            return (
            <>
                {locations.map((loc, index) => 
                <p key={index} onClick={() => handleMapOpen(loc)}>🚩 {loc}</p>)}
            </>
            );
        }

        return (
            <p onClick={() => handleMapOpen(locations)}>🚩 {locations}</p>
        )
    }

    const deleteItem = async () => {
        try {
            const response = await deleteData(`/product/delete/${itemKey}`);
            if(response.status === 200) {
                showToast("상품을 삭제했습니다!", "success");
                navigate("/home");
            } else {
                showToast("상품을 삭제하지 못했습니다...", "error")
            }
        } catch (err) {
            showToast("네트워크 오류가 발생했습니다!", "error");
            console.log(err);
        }
    }

    if (loading) return <div>상품을 가져오고 있어요!</div>;
    if (!item || Object.keys(item).length === 0) {
        showToast("상품이 없습니다!", "error");
        navigate("/home");
    }

    if(!item) return;

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
                            {(parentCate && currentCate) &&
                            <div className="item-category">
                                <a href="/search">메인</a>
                                &gt;
                                {parentCate && 
                                <>
                                    <a href={`/search?${parentKey}`}>{parentCate.catename}</a>
                                    {currentCate != parentCate &&
                                    <>
                                        &gt;
                                        <a href={`/search?${currentCate.cateKey}`}>{currentCate.catename}</a>
                                    </>
                                    }
                                </>
                                }
                            </div>
                            }
                            {/* 제목 */}
                            <label>{item.subject}</label>
                            {/* 가격 */}
                            <label>
                                {item.price === 0 ? "무료" : item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "원"}
                            </label>

                            {/* 몇분전, 조회, 채팅방 수, 찜 수 */}
                            <p>{getDayMinuteCounter(item.writeDate)} | 조회 {item.viewcnt} | 채팅 {0} | 찜 {itemsLike}</p>

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
                        {item.userKey !== userKey ?
                        <div className="item-Btns">
                            <LikeButton item={item} size={35} />
                            <button type="button" className="item-chat-btn">채팅하기</button>
                            <button type="button" className="item-purchase-btn">구매하기</button>
                        </div>
                        :
                        <div className="item-user-btn">
                            <button type="button" className="edit-btn" onClick={() => navigate(`/product/modify/${itemKey}`, { state: { item: item, category: cate } })}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 512 512">
                                    <path fill="#ffffff" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                                </svg>
                                <p>수정하기</p>
                            </button>
                            <button type="button" className="delete-btn" onClick={() => setShowDelete(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="22.5" viewBox="0 0 448 512">
                                    <path fill="#ffffff" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                </svg>
                                <p>삭제하기</p>
                            </button>
                        </div>
                        }   
                        <Modal
                            isOpen={showDelete}
                            onClose={() => setShowDelete(false)}
                            onConfirm={deleteItem}
                            title={"상품 삭제하기"}
                            message={"해당 상품을 삭제 하시겠어요?"}
                            cancelText={"아니요 남겨둘게요!"}
                            confirmText={"네 삭제할게요!"}
                        />
                    </div>
                </div>
                <div className="item-row">
                    <div className="item-subInfo">
                        <div className="item-content-box">
                            <label>상품정보</label>
                            <div className="item-content">
                                {item.content && (
                                    <Viewer key={item.itemKey} initialValue={item.content} />
                                )}
                            </div>
                        </div>
                        <div className="item-seller-box">
                            <label>판매자 정보</label>
                            <div className="item-seller">
                                <p onClick={() => navigate(`/user/${item.userKey}`)}>{item.useralias}</p>
                                <img onClick={() => navigate(`/user/${item.userKey}`)} src={`http://localhost:8093/item-images/temp/userImgTemp.png`}/>
                            </div>
                            {/* 추가적인 판매자 정보 추가 필요함 */}
                            {/* ex) 신뢰 점수, 거래 완료 수, 리뷰 수 등... */}
                        </div>
                    </div>                    
                </div>
                <div className="item-row">
                    <div className="seller-product">
                        <label>판매자의 다른 상품</label>
                        {sellerItem.length != 0 ?
                            <div className="seller-product-box">
                                <ItemCardList items={sellerItem} style={"Small"} pageStyle={""} />
                            </div>
                            :
                            <EmptyBox content={"판매자의 다른 상품이 없네요.. 나중에 다시 확인해주세요!"} />
                        }
                    </div>
                </div>
                <div className="item-row">
                    <div className="category-product">
                        <label>관련된 다른 상품들</label>
                        {itemsSameCate.length != 0 ?
                        <div className="category-product-box">
                            <ItemCardList items={itemsSameCate} style={"Small"} pageStyle={""} />
                        </div>
                        : 
                        <EmptyBox content={"관련된 상품이 없네요.. 나중에 다시 확인해주세요!"} />
                        }
                    </div>
                </div>
                <SidePage 
                    className={"kakaoMap"} 
                    isOpen={showMap} 
                    onClose={() => setShowMap(false)}
                    headerText={"희망거래지역"} 
                    content={
                    <MapShow 
                        isOpen={showMap}
                        className={"side-kakaomap"}
                        data={sideMapLocation}
                    />
                    } 
                />
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
        elapsedText = Math.trunc(elapsedTime / hour) + "시간 전";
    } else if (elapsedTime < (day * 15)) {
        elapsedText = Math.trunc(elapsedTime / day) + "일 전";
    } else {
        elapsedText = postdate.toLocaleDateString("ko-KR", {dateStyle: "medium",})
    }

    return elapsedText;
}

export default ItemDetail;