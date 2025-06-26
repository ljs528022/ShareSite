import { useState } from "react";
import "../css/components/userTrust.css";

const UserTrustScore = ({ score, onLabel }) => {

    const [ showScoreInfo, setShowScoreInfo ] = useState(false);

    const color = getTemperatureColor(score);
    
    if(!score) return;

    return (
        <div className="user-score">
            {onLabel && <p className="user-score-label" style={{color: color}}>유저 신뢰도</p>}
            <div className="user-score-bar" onMouseOver={() => setShowScoreInfo(true)} onMouseOut={() => setShowScoreInfo(false)}>
                <div className="user-score-bar-score" style={{ width: `${score}%`, backgroundColor: color }} />
                <div className="user-score-bar-background" style={{width: `${100 - score}%`}} />
            </div>
            {showScoreInfo &&
            <div className="user-score-info">
                <p style={{color: getTemperatureColor(score)}}>{`[ 유저 신뢰도 설명 ]`}</p>
                <p>{`현재 온도: ${score}℃`}</p>
                <div>
                <pre style={{fontFamily: "none"}}>
                    {`0 ~ 100도 사이의 온도에 따라 회원의\n거래 매너를 파악할 수 있는 지표입니다.\n기본적으로 20도로 시작하며,\n거래 후기와 신고 내역의 영향을 받아\n온도가 오르거나 내려갑니다.
                    `}
                    </pre>
                </div>
            </div>
            }
        </div>
    )
};

const getTemperatureColor = (score) => {
    if (score <= 20) return '#2196F3';
    if (score <= 40) return '#42A5F5';
    if (score <= 60) return '#FFEB3B';
    if (score <= 80) return '#FF9800';
    return '#F44336';
}

export default UserTrustScore;