import "../components/css/itemCard.css";

const ItemCard = ({ item, style }) => {

    const mainImage = item.images.find(img => img.main) || { imgUrl: "/item-images/temp/SSicon.png" };

    return (
        <>
            <a href={`/product/${item.itemKey}`}>
                <div className={`${style}_Card_wrapper`}>
                    <img 
                        className={`${style}_Card_img`}
                        src={`http://localhost:8093${mainImage.imgUrl}`}
                        alt="상품 이미지"
                    />
                    <div className={`${style}_CardBody`}>
                        <p className={`${style}_Card_subject`}>{item.subject}</p>                                    
                        <p className={`${style}_Card_price`}>
                            {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
                        </p>
                        {style == "Normal" &&
                        <div className={`${style}_CardsubBody`}>
                            <span className={item.tradestatus == 0 ? `${style}_Card_trading` : `${style}_Card_traded`}>
                                {item.tradestatus == 0 ? "거래중" : "거래완료"}
                            </span>
                            <span className={`${style}_Card_writeTime`}>{getDayMinuteCounter(item.writeDate)}</span>
                        </div>
                        }
                    </div>
                </div>
            </a>
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

export default ItemCard;