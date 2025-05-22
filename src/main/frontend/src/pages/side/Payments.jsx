import { useEffect, useState } from "react";
import { useToast } from "../../util/ToastContext";
import { useNavigate } from "react-router-dom";
import { getData } from "../../services/api";
import { useUser } from "../../services/UserContext";

const Payments = () => {

    const { user } = useUser();
    const [ userPayment, setUserPayment ] = useState(null);
    const [ paymentItem, setPaymentItem ] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();

    // 본인이 거래한 상품 받아오기
    useEffect(() => {
        const getUserPayments = async () => {
            try {
                const response = await getData(`/api/payment/${user.userKey}`);
                const { userPayments, items } = response.data;
                setUserPayment(userPayments);
                setPaymentItem(items);
            } catch {
                showToast("거래한 상품을 받아오지 못했습니다..!", "error");
            }
        }
        getUserPayments();
    }, []);

    // 본인이 작성한 거래후기 받아오기
    // TODO

    // 받아온 상품들 분류해서 뿌리기
    const fetchPayments = () => {
        if(!userPayment && !paymentItem) return;

        
    }

    const handleCancel = () => {

    }

    const handleConfirm = () => {

    }

    if(!userPayment && !paymentItem) return;

    return (
        <div>
            

        </div>
    );
}

export default Payments;