import { useEffect, useState } from "react";
import "../../css/side/review.css";
import { useUser } from "../../services/UserContext";
import { getData, postData } from "../../services/api";
import { useToast } from "../../util/ToastContext";

const WriteReview = ({ sellerInfo, onClose }) => {

    const { user } = useUser();

    const { showToast } = useToast();

    const [ reviewPage, setReviewPage ] = useState(0);
    const [ sellerData, setSellerData ] = useState(null);
    const [ reviewData, setReviewData ] = useState({
        sellerKey: sellerInfo,
        buyerKey: user.userKey,
        reviewScore: 0,
        reviewDetail: "",
    });

    useEffect(() => {
        const getSellerInfo = async () => {
            const response = await getData(`/user/getSellerInfo/${sellerInfo}`);
            if(response.status === 200) {
                setSellerData(response.data);
            }
        }
        getSellerInfo();
    }, []);

    const handleInput = (e) => {
        const { id, value } = e.target;
        setReviewData(prev => ({ ...prev, [id] : value }));
    }

    const handleSubmit = async () => {
        if(reviewData.reviewScore === 0) {
            showToast("거래에 대한 평가를 남겨주새요!", "error");
            return;
        }

        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        const response = await postData("/api/review/write", reviewData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(response.status === 200) {
            showToast("성공적으로 리뷰를 저장했습니다!", "success");
            onClose();
        }
    }

    if(!sellerData) return;

    return (
        <div className="review-wrapper">
            <h4 className="review-label">
                {reviewPage === 0 ? `"${sellerData.username}"님과의 거래는 어떠셨나요?`
                : reviewPage === 1 ? `이런 점이 좋았어요`
                : reviewPage === 2 && `이런 점이 아쉬웠어요`}
            </h4>
            {reviewPage === 0 ?
            <div className="review-input">
                <button className="review-btn" onClick={() => setReviewPage(1)}>
                    <span className="review-btn-span">좋았어요</span>
                </button>
                <button className="review-btn" onClick={() => setReviewPage(2)}>
                    <span className="review-btn-span">아쉬웠어요</span>
                </button>
            </div>
            : reviewPage === 1 ?
            <div className="review-input">
                <button className="review-btn" onClick={() => {setReviewPage(0); setReviewData(prev => ({ ...prev, reviewScore: ""}));}}>
                    <span className="review-btn-span">좋았어요</span>
                </button>
                <label className={reviewData.reviewScore === "1" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={1} onChange={handleInput} checked={reviewData.reviewScore === "GOOD"}/>
                        <span className="review-btn-span">매너가 좋았어요.</span>
                </label>
                <label className={reviewData.reviewScore === "2" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={2} onChange={handleInput} checked={reviewData.reviewScore === "FAST"}/>
                        <span className="review-btn-span">답장이 빨랐어요.</span>
                </label>
                <label className={reviewData.reviewScore === "3" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={3} onChange={handleInput} checked={reviewData.reviewScore === "KEEPTIME"}/>
                        <span className="review-btn-span">상품 상태가 좋았어요.</span>
                </label>
                <label className={reviewData.reviewScore === "4" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={4} onChange={handleInput} checked={reviewData.reviewScore === "WELLPOST"}/>
                        <span className="review-btn-span">택배 거래가 수월했어요.(포장, 협조적)</span>
                </label>
                <label className={reviewData.reviewScore === "5" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={5} onChange={handleInput} checked={reviewData.reviewScore === "KEEPTIME"}/>
                        <span className="review-btn-span">거래 시간을 잘 지켰어요.</span>
                </label>
            </div>
            : reviewPage === 2 &&
            <div className="review-input">
                <button className="review-btn" onClick={() => {setReviewPage(0); setReviewData(prev => ({ ...prev, reviewScore: ""}));}}>
                    <span className="review-btn-span">아쉬웠어요</span>
                </button>
                <label className={reviewData.reviewScore === "11" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={11} onChange={handleInput} checked={reviewData.reviewScore === "BAD"}/>
                        <span className="review-btn-span">매너가 안 좋았어요.</span>
                </label>
                <label className={reviewData.reviewScore === "12" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={12} onChange={handleInput} checked={reviewData.reviewScore === "LATE"}/>
                        <span className="review-btn-span">답장이 너무 느렸어요.</span>
                </label>
                <label className={reviewData.reviewScore === "13" ? "review-btn-checked" : "review-btn"}>
                    <input id="reviewScore" type="radio" value={13} onChange={handleInput} checked={reviewData.reviewScore === "KEEPTIME"}/>
                    <span className="review-btn-span">상품 상태가 안 좋았어요.</span>
                </label>
                <label className={reviewData.reviewScore === "14" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={14} onChange={handleInput} checked={reviewData.reviewScore === "BADPOST"}/>
                        <span className="review-btn-span">택배 거래가 힘들었어요.(포장, 비협조적)</span>
                </label>
                <label className={reviewData.reviewScore === "15" ? "review-btn-checked" : "review-btn"}>
                        <input id="reviewScore" type="radio" value={15} onChange={handleInput} checked={reviewData.reviewScore === "LOSTTIME"}/>
                        <span className="review-btn-span">거래 시간을 잘 지키지 않았어요.</span>
                </label>
            </div>
            }
            <textarea className="review-detail" id="reviewDetail" onChange={handleInput}/>
            <button type="button" className="review-submit-btn" onClick={handleSubmit}>제출</button>
        </div>
    )
}

export default WriteReview;