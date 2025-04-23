import style from "../components/css/itemCard.module.css"

const ItemCard = ({ item }) => {
    return (
        <>
            {item.map((i, index) => (
                <a key={i.itemKey || index} href={`/product?${i.itemKey}`}>
                <div className={style.Normal_Card_wrapper}>
                    <img className={style.Normal_Card_img_temp} src={!i.img ? "./SSicon.png" : i.img} />
                    <div className={style.Normal_CardBody}>
                        <p className={style.subject}>{i.subject}</p>                                    <p className={style.price}>{i.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</p>
                        <span className={i.tradestatus == 0 ? style.span_trading : style.span_traded}>
                            {i.tradestatus == 0 ? "거래중" : "거래완료"}
                        </span>
                        <span className={style.span_time}>{getDayMinuteCounter(i.writeDate)}</span>
                    </div>
                </div>
                </a>
            ))}
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

export default ItemCard;