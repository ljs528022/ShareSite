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

            console.log(event);

            const { orderId: receivedOrderId, paymentInfo } = event.data;
            if(receivedOrderId === orderId) {
                setPaymentData(paymentInfo);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [orderId]);

    const completePayment = async () => {
        await postData("/api/payment/complete", { orderId });
        window.opener.postMessage("PAYMENT_SUCCESS", "*");
        window.close();
    };

    if (!paymentData) return <div>결제 정보를 불러오는 중...</div>

    return (
        <div>
            <h2>임시 결제 페이지</h2>
            <p>주문 번호: {orderId}</p>
            <p>결제 금액: {paymentData.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</p>
            <p>거래 방법: {paymentData.tradeType === "0" ? "택배" : "직거래"}</p>
            <p>결제 종류: {paymentData.purType}</p>
            {paymentData.location && <p>배송지: {paymentData.location}</p>}
            <div>
                <button onClick={completePayment}>결제 취소</button>
                <button onClick={completePayment}>결제 완료</button>
            </div>
        </div>
    )

}

export default PaymentPage;