import { useState } from "react";
import style from "../components/css/itemCard.module.css"

const ItemCards = ({ items }) => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ pagePerItem, setPagePerItem ] = useState(4);
    const [ maxPageButtons, setMaxPageButtons ] = useState(5);
    
    const item = [];
    items.map((i) => {
        item.push(i);
    });

    const totalPage = Math.ceil(item.length / pagePerItem);

    const renderItem = () => {

        const startIndex = (currentPage - 1) * pagePerItem;
        const endIndex = startIndex + pagePerItem - 1;
        const currentItems = item.slice(startIndex, endIndex + 1);

        return currentItems.map((i, index) => (
            // 상품을 누르면 해당 상품으로 이동하게 해야함
            <a key={i.itemKey || index} href={`/product?${i.itemKey}`}>
            <div className={style.Normal_Card_wrapper}>
                <img className={style.Normal_Card_img_temp} src={!i.img1 ? "./SSicon.png" : i.img1} />
                <div className={style.Normal_CardBody}>
                    <p className={style.subject}>{i.subject}</p>
                    <p className={style.price}>{i.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</p>
                    <span className={i.tradestatus == 0 ? style.span_trading : style.span_traded}>
                        {i.tradestatus == 0 ? "거래중" : "거래완료"}
                    </span>
                    <span className={style.span_time}>{getDayMinuteCounter(i.writeDate)}</span>
                </div>
            </div>
            </a>
        ));
    }

    const handlePageChange = (page) => {
        if(page < 1 || page > totalPage) return;
        setCurrentPage(page);
    }

    const renderPaginationButtons = () => {
        if(totalPage === 0) return null;

        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPage, startPage + maxPageButtons - 1);

        if(endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        const buttons = [];

        for(let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button key={i} onClick={() => handlePageChange(i)}
                className={i === currentPage ? style.buttonSelected : style.button} />
            )
        }

        return buttons;
    }

    return (
        <>
            {renderItem()}
            <button></button>
            <button></button>

            <div className={style.paginaton}>{renderPaginationButtons()}</div>
        </>
    );   
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

export default ItemCards;