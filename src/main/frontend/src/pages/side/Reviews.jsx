import { useEffect, useState } from "react";
import { useToast } from "../../util/ToastContext";
import { postData } from "../../services/api";
import "../../css/side/review.css";
import { FaRegCommentDots } from "react-icons/fa";

const Reviews = ({ reviews }) => {

    const GOOD_REVIEW_TAG = ["GOOD", "FAST", "GOODITEM", "WELLPOST", "KEEPTIME"];
    const BAD_REVIEW_TAG = ["BAD", "LATE", "BADITEM", "BADPOST", "LOSTTIME"];

    const REVIEW_TAG_LABELS = {
        GOOD: "매너가 좋았어요.",
        FAST: "답장이 빨랐어요.",
        GOODITEM: "상품 상태가 좋았어요.",
        WELLPOST: "택배 거래가 수월했어요.",
        KEEPTIME: "거래 시간을 잘 지켰어요.",

        BAD: "매너가 안 좋았어요.",
        LATE: "답장이 너무 느렸어요.",
        BADITEM: "상품 상태가 안 좋았어요.",
        BADPOST: "택배 거래가 힘들었어요.",
        LOSTTIME: "거래 시간을 잘 지키지 않았어요."
    };

    const goodReviews = reviews.filter(r => GOOD_REVIEW_TAG.includes(r.reviewScore));
    const badReviews = reviews.filter(r => BAD_REVIEW_TAG.includes(r.reviewScore));
    const detailReviews = reviews.filter(r => r.reviewDetail !== "");

    const [ reviewUsers, setReviewUsers ] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        if(!detailReviews) return;
        const buyers = Array.from(new Set(detailReviews.map(r => r.buyerKey)));

        if(buyers.length === 0) return;

        const token = sessionStorage.getItem('token');
        const getReviewUser = async () => {
            try {
                const response = await postData(`/user/getReviewUsers`, buyers, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if(response.status === 200) {
                    setReviewUsers(response.data);
                }
            } catch {
                showToast("통신 에러가 발생했습니다...", "error");
            }
        }
        getReviewUser();
    }, [])

    const goodReviewsByScore = GOOD_REVIEW_TAG.reduce((acc, tag) => {
        acc[tag] = goodReviews.filter(r => r.reviewScore === tag);
        return acc;
    }, {});

    const badReviewsByScore = BAD_REVIEW_TAG.reduce((acc, tag) => {
        acc[tag] = badReviews.filter(r => r.reviewScore === tag);
        return acc;
    }, {});

    if(!reviews && !reviewUsers) return;

    return (
        <div className="review-wrapper">
            <div className="review-box">
                <label className="review-list-label">이런 점이 좋았어요</label>
                {goodReviews.length > 0 ?
                <div className="review-list">
                {GOOD_REVIEW_TAG.map(tag => (
                goodReviewsByScore[tag] && goodReviewsByScore[tag].length > 0 &&
                    <ul key={tag}>
                        {goodReviewsByScore[tag].map(r => (
                            <li key={r.id}>
                                <strong>{REVIEW_TAG_LABELS[tag]}</strong>
                                <span>
                                    {goodReviewsByScore[tag].length}
                                </span>
                            </li>
                        ))}
                    </ul>
                ))}
                </div>
                :
                <div className="review-empty">
                    <FaRegCommentDots size={20} color="#888"/>
                    <p style={{margin: 0, color: "#888"}}>{"아직 리뷰가 없습니다..."}</p>
                </div>
                }
            </div>
            <div className="review-box-blank" />
            <div className="review-box">
                <label className="review-list-label">이런 점이 아쉬웠어요</label>
                {badReviews.length > 0 ?
                <div className="review-list">
                {BAD_REVIEW_TAG.map(tag => (
                    badReviewsByScore[tag] && badReviewsByScore[tag].length > 0 &&
                    <ul key={tag}>
                        {badReviewsByScore[tag].map(r => (
                            <li key={r.id}>
                                <strong>{REVIEW_TAG_LABELS[tag]}</strong>
                                <span>
                                    {badReviewsByScore[tag].length}
                                </span>
                            </li>
                        ))}
                    </ul>
                ))}
                </div>
                :
                <div className="review-empty">
                    <FaRegCommentDots size={20} color="#888"/>
                    <p style={{margin: 0, color: "#888"}}>{"아직 리뷰가 없습니다..."}</p>
                </div>
                }   
            </div>
            {detailReviews.length > 0 &&
            <>
            <div className="review-box-blank" />
            <div className="review-box">
                <label className="review-list-label">상세한 후기도 있어요 <strong style={{color: "#91B4FF"}}>{detailReviews.length}</strong></label>
                {detailReviews.map(r => {
                    if(reviewUsers !== null) {
                        const user = reviewUsers.find(u => u.userKey === r.buyerKey);
                        const date = new Date(r.writeDate);
                        return (
                            <div className="review-list-user" key={r.id}>
                                <div className="review-user-row">
                                    <img 
                                        className="review-user-img"
                                        src={user.userimg !== "" ? `http://localhost:8093${user.userimg}` : 'http://localhost:8093/item-images/temp/userImgTemp.png'}
                                    />
                                    <div className="review-user-box">
                                        <span>{user.useralias}</span>
                                        <span>
                                            {r.sellerKey === user.userKey ? "판매자" : "구매자"} | {date.toLocaleDateString("ko-KR", {dateStyle: "medium",})}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-user-row">
                                    <pre>
                                        {r.reviewDetail}
                                    </pre>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            </>
            }
        </div>
    );
}

export default Reviews;