import { useState } from "react";
import { useToast } from "../util/ToastContext";
import { getData } from "../services/api";
import { FaSearch } from "react-icons/fa";

const Report = () => {

    const [ keyword, setKeyword ] = useState('');
    const [ reportInfo, setReportInfo ] = useState([]);
    const [ showContents, setShowContents ] = useState(null);

    const { showToast } = useToast();

    const getReport = async () => {
        if(keyword === '') {
            showToast("조희할 수 없는 정보입니다", "error");
            return;
        }

        try {            
            const response = await getData(`/report?keyword=${keyword}`); 
            if(response.status === 200) {
                const reports = response.data;
                const editedReports = transfromReportData(reports);
                setReportInfo(editedReports);
                setKeyword("");
            }
        } catch {
            showToast("통신 장애가 발생했습니다..!", "error");
            setKeyword("");
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault(); 
            getReport();
        }
    }

    const fetchReports = (reports) => {
        if(reports.length === 0) return;

        return (
        <div className="report-result-wrapper">
            <h3>신고 이력 요약</h3>

            <div className="report-result-box">
                <div>
                    <p className="report-result-label">최근 신고일</p>
                    <p style={{color: "#7badff", fontSize: "18px"}}>{reports.lastedDate}</p>
                </div>
                <div>
                    <p className="report-result-label">총 신고 건수</p>
                    <p style={{color: "#7badff", fontSize: "18px"}}>{reports.count}</p>
                </div>
            </div>
            <ul className="report-result-reason">
                {reports.reasonStats.map((r, i) => (
                    <li key={i} className="report-result-list">
                        <p>{r.reasonLabel}</p>
                        <p 
                        style={{textDecoration: "underline", cursor: "pointer"}}
                        onMouseOver={() => setShowContents(i)}
                        onMouseOut={() => setShowContents(null)}
                        >{r.count}건</p>
                        {showContents === i &&
                        <div className="report-result-content">
                            {r.contents.slice(0, 3).map((c, i) => (
                                <p key={i}>{c}</p>
                                
                            ))}
                            {r.contents.length > 3 && <p>...</p>}
                        </div>
                        }
                    </li>
                ))}
            </ul>
        </div>
        )
    }
 
    return (
    <main>
        <form>
        <div className="report-search-wrapper">
            <h3>안전한 거래를 위한 한 걸음</h3>
            <div className="report-search-box">
                <FaSearch size={20} color="#777" onClick={getReport} style={{cursor: "pointer"}}/>
                <input 
                    id="keyword" 
                    value={keyword} 
                    placeholder="회원 번호, 이름, 이메일을 입력"
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{width: "", backgroundColor: " white", outline: "none"}}
                    autoComplete="off"
                />
            </div>
            <a
            style={{fontSize:"12px", margin: "0 auto", marginTop: "3px"}}
            >최근에 3개월 내 사이트에서 발생한 신고 내역을 조회합니다.</a>
            
            {fetchReports(reportInfo)}
        </div>
        </form>


    </main>
    );
};

function transfromReportData(report) {
    if(!report.length === 0) return null;

    const reasonMap = {
        1: "거래 불이행",
        2: "허위 매물 등록",
        3: "정보 도용 의심",
        4: "욕설 및 비난",
        5: "협박 및 무리한 요구",
    };

    const grouped = {};
    let lastedDate = null;

    report.forEach((report) => {
        const { reason, content, createdAt } = report;

        const date = new Date(createdAt);
        if(!lastedDate || date > new Date(lastedDate)) {
            lastedDate = createdAt;
        }

        if(!grouped[reason]) {
            grouped[reason] = {
                reason,
                reasonLabel: reasonMap[reason] || "기타 사유(직접 입력)",
                count: 0,
                contents: []
            };
        }
        grouped[reason].count += 1;
        grouped[reason].contents.push(content);
    });

    return {
        lastedDate: lastedDate?.slice(0, 10),
        count: report.length,
        reasonStats: Object.values(grouped)
    };
}

export default Report;