import { useEffect, useState } from "react";
import "../../css/side/purchase.css";
import { useToast } from "../../util/ToastContext";
import Modal from "../../util/Modal";
import ItemCard from "../../components/itemCard";
import LocationList from "./LocationList";
import { getData, postData } from "../../services/api";

const Purchase = ({ onClose, sellerInfo, buyerInfo, itemInfo }) => {

    const [ purInfo, setPurInfo ] = useState({
        sellerKey: sellerInfo.userKey,
        buyerKey: buyerInfo.userKey,
        itemKey: itemInfo.itemKey,
        tradeType: 2,
        purType: "",
    });

    const [ cancelPurchase, setCancelPurchase ] = useState(false);
    const [ selectedLoc, setSelectedLoc ] = useState(null);
    const [ purchasePage, setPurchasePage ] = useState(2);
    const [ changeLoc, setChangeLoc ] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const handleMessage = async (event) => {
            if(event.origin !== window.location.origin) return;

            if(event.data?.type === "READY_FOR_PAYMENT") {
                const { orderId } = event.data;
                const paymentInfo = JSON.parse(sessionStorage.getItem(`payment-${orderId}`));
                event.source.postMessage({ orderId, paymentInfo }, event.origin);
            }

            if(event.data === "PAY_SUCCESS") {
                const res = await getData(`/api/payment/status/${event.data.orderId}`);
                const status = res.data.status;
                showToast(`결제 상태: ${status}`);
            }
            
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [])

    const handleInput = (e) => {
        const { id, value } = e.target;
        setPurInfo(prev => ({ ...prev, [id]: value }));
    }

    const handlePayment = async () => {
        if(purInfo.tradeType === 0 && !selectedLoc) { showToast("배송지를 고르지 않으셨어요!", "error"); return; }
        if(purInfo.purType === "") { showToast("결제 방식을 선택해주세요!", "error"); return; }

        const paymentList = {
            itemId: purInfo.itemKey,
            amount: itemInfo.price,
            userId: purInfo.buyerKey,
            tradeType: purInfo.tradeType,
            purType: purInfo.purType,
            location: selectedLoc,
        }

        const res = await postData("/api/payment/ready", paymentList);
        if(!res) {
            showToast("결제 진행 중에 문제가 발생했습니다..", "error"); return;
        }

        const { orderId, ...paymentInfo } = res.data;
        sessionStorage.setItem(`payment-${orderId}`, JSON.stringify(paymentInfo));


        const popup = window.open(
            `/mock-payment/${orderId}`,
            "PaymentPopup",
            "width=500,height=500"
        );
    }

    return (
        <>
        {(purchasePage >= 2 && !changeLoc) ?
        <div className="purchase-wrapper">
            <label className="purchase-closeBtn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 384 512">
                    <path fill="#5c5c5c" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </label>
            <div className="purchase-box">
                <label className="purchase-label">
                    원하시는 거래방식을 선택 해주세요!
                </label>
            </div>
            <div className="purchase-box">
                <label className={purInfo.tradeType == 0 ? "purchase-radio-checked" : "purchase-radio"}>
                    <input id="tradeType" type="radio" value={0} onChange={handleInput} checked={purInfo.tradeType == 0}/>
                    <span className="purchase-radio-span">택배 거래</span>
                    <p className="purchase-radio-p">원하시는 주소로 택배를 받으실 수 있어요</p>
                </label>
                <label className={purInfo.tradeType == 1 ? "purchase-radio-checked" : "purchase-radio"}>
                    <input id="tradeType" type="radio" value={1} onChange={handleInput} checked={purInfo.tradeType == 1}/>
                    <span className="purchase-radio-span">직거래</span>
                    <p className="purchase-radio-p">채팅으로 약속을 잡고 만나서 상품을 받으세요</p>
                </label>
            </div>
            <div className="purchase-box">
                <button type="button" className="purchase-next-btn" 
                    onClick={() => {
                        if(purInfo.tradeType == 2) {
                            showToast("거래 방식을 선택해주세요!", "warning");
                            return;
                        } else if (purInfo.tradeType == 1) {
                            setPurchasePage(1)
                        } else setPurchasePage(0);
                    }}
                >다음</button>
            </div>
        </div>
        : (purchasePage <= 1 && !changeLoc) ?
        <div className="purchase-wrapper">
            <label className="purchase-closeBtn" onClick={() => setCancelPurchase(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 384 512">
                    <path fill="#5c5c5c" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </label>
            {/* 상품 표시 및 거래 방법 표시 란 */}
            <div className="purchase-box">
                <label className="purchase-label">
                    {purchasePage === 1 ? "직거래로 구매" : "택배로 구매"}
                </label>
                <ItemCard item={itemInfo} style={"Purchase"}/>
            </div>
            <div className="purchase-blank"></div>
            {purchasePage === 0 &&
            <>
            {/* 배송지 표시 및 변경 란 */}
            <div className="purchase-box-loc">
                <label className="purchase-label">
                    배송지 이름
                </label>
                <button type="button" className="purchase-locBtn" onClick={() => setChangeLoc(true)}>변경</button>
            </div>
                {selectedLoc &&
                <div className="purchase-loc">
                    <p>{selectedLoc.useralias}</p>
                    <p>{`[${selectedLoc.zoneCode}] ${selectedLoc.address}`}</p>
                    <p>{selectedLoc.detail}</p>
                </div>
                }
            <div className="purchase-blank"></div>
            </>
            }
            {/* 상품 결제 방법 선택 란 */}
            <div className="purchase-box">
                <label className="purchase-label">
                    결제 방법
                </label>
                <div className="purchase-purType">
                    <label className={purInfo.purType === "PAYCO" ? "purType-radio-checked" : "purType-radio"} 
                    style={{gridRow: 1, gridColumn: "span 2", color: "red"}}>
                        <input id="purType" type="radio" value={"PAYCO"} onChange={handleInput} checked={purInfo.purType == "PAYCO"}/>
                        <span className="purType-radio-span">PAYCO</span>
                    </label>
                    <label className={purInfo.purType === "CREDIT" ? "purType-radio-checked" : "purType-radio"} 
                    style={{gridRow: 2, gridColumn: 1}}>
                        <input id="purType" type="radio" value={"CREDIT"} onChange={handleInput} checked={purInfo.purType == "CREDIT"}/>
                        <span className="purType-radio-span">카드 결제</span>
                    </label>
                    <label className={purInfo.purType === "NAVERPAY" ? "purType-radio-checked" : "purType-radio"} 
                    style={{gridRow: 2, gridColumn: 2, color: "#2DB400"}}>
                        <input id="purType" type="radio" value={"NAVERPAY"} onChange={handleInput} checked={purInfo.purType == "NAVERPAY"}/>
                        <span className="purType-radio-span">NPAY</span>
                    </label>
                    <label className={purInfo.purType === "KAKAOPAY" ? "purType-radio-checked" : "purType-radio"} 
                    style={{gridRow: 3, gridColumn: 1, color: "#0064FF"}}>
                        <input id="purType" type="radio" value={"KAKAOPAY"} onChange={handleInput} checked={purInfo.purType == "KAKAOPAY"}/>
                        <span className="purType-radio-span">TOSS PAY</span>
                    </label>
                    <label className={purInfo.purType === "TOSSPAY" ? "purType-radio-checked" : "purType-radio"} 
                    style={{gridRow: 3, gridColumn: 2, color: "#FFE300"}}>
                        <input id="purType" type="radio" value={"TOSSPAY"} onChange={handleInput} checked={purInfo.purType == "TOSSPAY"}/>
                        <span className="purType-radio-span">KAKAO PAY</span>
                    </label>
                    <label className={purInfo.purType === "DEPOSIT" ? "purType-radio-checked" : "purType-radio"} 
                    style={{gridRow: 4, gridColumn: "span 2"}}>
                        <input id="purType" type="radio" value={"DEPOSIT"} onChange={handleInput} checked={purInfo.purType == "DEPOSIT"}/>
                        <span className="purType-radio-span">무통장 입금</span>
                    </label>
                </div>
                <button type="button" className="purchase-btn" onClick={handlePayment}>
                    {itemInfo.price === 0 ? "무료" : itemInfo.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "원"} 결제
                </button>
            </div>
        </div>
        :
        // 배송지 변경 창
        <div className="purchase-box">
            <label className="purchase-closeBtn" onClick={() => setChangeLoc(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 384 512">
                    <path fill="#5c5c5c" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </label>
            <LocationList onSelectLocation={(loc) => {
                setSelectedLoc(loc);
                setChangeLoc(false);
                showToast("해당 배송지로 설정합니다!");
            }}/>
        </div>
        }
        <Modal 
            isOpen={cancelPurchase}
            onClose={() => setCancelPurchase(false)}
            onConfirm={onClose}
            style="side-"
            message={"진행 중이던 거래를 \n 취소하시겠어요?"}
            confirmText={"확인"}
            cancelText={"취소"}
        />
        </>
    )
}

export default Purchase;