import style from "../components/css/itemCard.module.css"

const SmallItemCard = ({ items }) => {

    return (
        <>
            <div className="Small_Card_wrapper">
                {/* <Card>
                    <Card.Img variant="top" src=""/>
                    <Card.Body>
                        <Card.Title>상품명</Card.Title>
                        <p>200,000원</p>
                        <Badge bg="danger"></Badge>
                        <p></p>
                    </Card.Body>
                </Card> */}
            </div>
        </>
    );
}

const NormalItemCard = ({ items }) => {

    const item = [];

    // 대체 이미지
    const tempImg = "./public/SSLogo.jpg";

    items.map((i) => {
        item.push(i);
    });
    console.log(item);

    return (
        <>
            {item.length > 0 && item.map((i) => (
                <div className={style.Normal_Card_wrapper} key={i.itemKey}>
                    <img className={style.Normal_Card_img} src={`./public/SSLogo.jpg`} />
                    <div className={style.Normal_CardBody}>
                        <p className={style.subject}>{i.subject}</p>
                        <p className={style.price}>{i.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</p>
                        <span className={i.tradestatus == 0 ? style.span_trading : style.span_traded}
                        >{i.tradestatus == 0 ? "거래중" : "거래완료"}</span>

                        {/* 등록된 시간을 기준으로 지금 시간으로 부터 얼마나 되었는지 표시 */}
                        <span className={style.span_time}>{getDayMinuteCounter(i.writeDate)}</span>
                    </div>
                    <div>
                        <div></div>
                    </div>
                </div>
            ))}
        </>
    );
}

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

export { SmallItemCard, NormalItemCard };