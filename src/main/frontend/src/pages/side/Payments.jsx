import { useEffect, useState } from "react";
import { useToast } from "../../util/ToastContext";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, postData } from "../../services/api";
import { useUser } from "../../services/UserContext";
import ItemCard from "../../components/itemCard";
import "../../css/components/payment.css";
import EmptyBox from "../../components/EmptyBox";

const Payments = ({ setShowReview }) => {

    const { user } = useUser();
    const [ infoChanged, setInfoChanged ] = useState(false);
    const [ sameIndex, setSameIndex ] = useState(null);
    const [ purchaseInfo, setPurchaseInfo ] = useState(null);
    const [ paymentReviews, setPaymentReviews ] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();

    // 본인이 거래한 상품 받아오기
    useEffect(() => {
        const getUserPayments = async () => {
            try {
                // 리뷰도도 받아서 가져와야 함
                const response = await getData(`/api/payment/buyer/${user.userKey}`);
                const { userPayments, items } = response.data;

                // 받아온 상품과 상품 구매 내역을 itemKey로 분류하기
                // 리뷰도 받아와서 merge 해야함
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

    // 본인이 작성한 거래후기 받아오기
    // TODO

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
        confirm("정말 해당 거래를 취소하시겠습니까?\n거래가 취소되면 해당 상품의 거래 내역이 삭제됩니다.");

        const response = await deleteData(`/api/payment/cancel/${orderKey}`);
        if(response.status === 200) {
            showToast("거래를 취소했습니다", "warning");
            setInfoChanged(prev => !prev);
        };
    }

    const handleConfirm = async ( e, orderKey ) => {
        e.preventDefault();
        confirm("판매자와의 거래를 확정합니다.\n확정하기 전에 거래가 잘 이루워졌는지 확인해주세요.");
        
        const response = await postData(`/api/payment/confirm/${orderKey}`);
        if(response.status === 200) {
            showToast("거래가 확정되었습니다!");
            setInfoChanged(prev => !prev);
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
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="22.25" viewBox="0 0 448 512">
                            <path fill="#4d4d4d" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                        </svg>
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
                        // 리뷰를 불러온게 없으면 남기기 버튼, 있으면 리뷰 내용을 출력
                        <div className="paymentInfo-row">
                            <button className="payments-btn-review" onClick={setShowReview}>거래 리뷰 남기기</button>
                        </div>
                        // ? 연산자로 불러올 예정정
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