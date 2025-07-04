import { useEffect, useState } from "react";
import { useToast } from "../../util/ToastContext";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, postData } from "../../services/api";
import { useUser } from "../../services/UserContext";
import ItemCard from "../../components/itemCard";
import "../../css/components/payment.css";
import EmptyBox from "../../components/EmptyBox";
import { FaAngleDown } from "react-icons/fa";

const Payments = ({ setShowReview }) => {

    const { user } = useUser();
    const [ infoChanged, setInfoChanged ] = useState(false);
    const [ sameIndex, setSameIndex ] = useState(null);
    const [ purchaseInfo, setPurchaseInfo ] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();

    // 본인이 거래한 상품 받아오기
    useEffect(() => {
        const getUserPayments = async () => {
            try {
                const response = await getData(`/api/payment/buyer/${user.userKey}`);
                const { userPayments, items } = response.data;

                // 받아온 상품과 상품 구매 내역을 itemKey로 분류하기
                const mergedData = userPayments.map(p => {
                    const item = items.find(i => i.itemKey === p.itemKey);
                    return {
                        ...p,
                        itemInfo: item || null,
                    };
                });
                // 분류된 상품 & 구매 내역 저장
                setPurchaseInfo(mergedData);
            } catch {
                showToast("거래한 상품이 없거나, 받아오지 못했습니다...", "error");
            }
        }
        getUserPayments();
    }, [infoChanged]);

    const selectPurchaseType = (type) => {
        switch (type) {
            case "PAYCO":
                return "PAYCO";
            case "CREDIT":
                return "카드 결제";
            case "NAVERPAY":
                return "네이버 페이";
            case "KAKAOPAY":
                return "카카오 페이";
            case "TOSSPAY":
                return "토스 페이";
            case "DEPOSIT":
                return "무통장 입금";
        }
    }

    const toggleOpen = (index) => {
        if(index === null) return;
        if(sameIndex === index) setSameIndex(null);
        if(sameIndex !== index) setSameIndex(index);
    }

    const formattedTime = ( time ) => {
        const formatted = new Date(time).toLocaleString("ko-KR", {
            year: "numeric",
            month:  "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return formatted;
    }

    const handleCancel = async ( e, orderKey ) => {
        e.preventDefault();
        const confirmed = confirm("정말 해당 거래를 취소하시겠습니까?\n거래가 취소되면 해당 상품의 거래 내역이 삭제됩니다.");

        if(confirmed) {
            const response = await deleteData(`/api/payment/cancel/${orderKey}`);
            if(response.status === 200) {
                showToast("거래를 취소했습니다", "warning");
                setInfoChanged(prev => !prev);
            };
        }
    }

    const handleConfirm = async ( e, orderKey ) => {
        e.preventDefault();
        const confirmed = confirm("판매자와의 거래를 확정합니다.\n확정하기 전에 거래가 잘 이루워졌는지 확인해주세요.");

        if(confirmed) {
            const response = await postData(`/api/payment/confirm/${orderKey}`);
            if(response.status === 200) {
                showToast("거래가 확정되었습니다! 리뷰를 남겨주시면 다른 회원분들에게 큰 도움이 됩니다!");
                setInfoChanged(prev => !prev);
            }
        }
    }

    if(!purchaseInfo) return;

    return (
        <div className="payments-wrapper">
            {purchaseInfo ? purchaseInfo.map((p, index) => (
                <div key={p.orderKey || index} className="payments-box">
                    <ItemCard item={p.itemInfo} style={"Side"}/>
                    <button 
                        className={`paymentInfo-btn ${index === sameIndex ? "rotated" : ""}`} 
                        onClick={() => {
                            setSameIndex(index)
                            toggleOpen(index)
                        }}
                    >
                        <FaAngleDown size={30} color="#555" />
                    </button>
                    {index === sameIndex &&
                    <div className="paymentInfo-box">
                        <div className="paymentInfo-row">
                            <p>주문 번호</p>
                            <span>{p.orderKey}</span>
                        </div>
                        <div className="paymentInfo-row">
                            <p>결제 방식</p>
                            <span>{selectPurchaseType(p.purType)}</span>
                        </div>
                        <div className="paymentInfo-row">
                            <p>결제 금액</p>
                            <span>{p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " 원"}</span>
                        </div>
                        <div className="paymentInfo-row">
                            <p>거래 방식</p>
                            <span>{p.tradeType === 0 ? "택배" : "직거래"}</span>
                        </div>
                        {p.tradeType === 0 &&
                        <div className="paymentInfo-row">
                            <p>배송지</p>
                            <span>{p.location}</span>
                        </div>
                        }
                        <div className="paymentInfo-row">
                            <p>거래 일자</p>
                            <span>{formattedTime(p.purchaseDate)}</span>
                        </div>
                        {!p.confirmed ?
                        <div className="paymentInfo-row">
                            <button className="payments-btn-cancel" onClick={(e) => handleCancel(e, p.orderKey)}>거래 취소</button>
                            <button className="payments-btn-confirm" onClick={(e) => handleConfirm(e, p.orderKey)}>거래 확정</button>
                        </div>
                        :
                        <div className="paymentInfo-row">
                            <button className="payments-btn-review" onClick={() => setShowReview(p.itemInfo.userKey)}>거래 리뷰 남기기</button>
                        </div>
                        }
                    </div>
                    }
                </div>
            ))
            :
            <h4 style={{color: "#999"}}>거래 내역이 없습니다!</h4>
        }
        </div>
    );
}

export default Payments;