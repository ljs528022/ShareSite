import { useParams } from "react-router-dom";
import { postData } from "../services/api";
import { useEffect, useState } from "react";
import "../css/components/payment.css";

function PaymentPage() {
    const { orderId } = useParams();
    const [ paymentData, setPaymentData ] = useState(null);
    
    useEffect(() => {
        window.opener.postMessage({ type: "READY_FOR_PAYMENT", orderId }, window.origin);

        const handleMessage = (event) => {
            if(event.origin !== window.location.origin) return;

            const { orderId: receivedOrderId, paymentInfo } = event.data;
            if(receivedOrderId === orderId) {
                setPaymentData(paymentInfo);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [orderId]);

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

    const cancelPayment = () => {
        confirm("진행 중이던 결제를 취소하시겠습니까?");
        window.opener.postMessage("PAYMENT_CANCEL", "*");
        window.close();
    }

    const completePayment = async () => {
        await postData("/api/payment/complete", { orderId, paymentData });
        window.opener.postMessage("PAYMENT_SUCCESS", "*");
        window.close();
    };

    
    if (!paymentData) return <div>결제 정보를 불러오는 중...</div>
    console.log(paymentData);

    return (
        <div className="payment-box">
            <h2>임시 결제 페이지</h2>
            <div className="payment-info">
                <p>주문 번호</p>
                <span>{orderId}</span>
            </div>
            <div className="payment-info">
                <p>결제 금액</p>
                <span>{paymentData.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</span>
            </div>
            <div className="payment-info">
                <p>결제 종류</p>
                <span>{selectPurchaseType(paymentData.purType)}</span>
            </div>
            <div className="payment-info">
                <p>거래 방법</p>
                <span>{paymentData.tradeType === "0" ? "택배" : "직거래"}</span>
            </div>
            {paymentData.location &&
            <div className="payment-info">
                <p>배송지</p>
                <span>{paymentData.location}</span>
            </div>
            }
            <p className="payment-confirm">
                해당 내용으로 결제를 진행하시겠습니까?
            </p>
            <div className="payment-btn">
                <button className="payment-btn-cancel" onClick={cancelPayment}>결제 취소</button>
                <button className="payment-btn-confirm" onClick={completePayment}>결제 확인</button>
            </div>
        </div>
    )

}

export default PaymentPage;