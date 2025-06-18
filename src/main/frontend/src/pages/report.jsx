import { useState } from "react";
import { useToast } from "../util/ToastContext";
import { getData } from "../services/api";
import { FaSearch } from "react-icons/fa";

const Report = () => {

    const [ keyword, setKeyword ] = useState('');
    const [ reportInfo, setReportInfo ] = useState(null);

    const { showToast } = useToast();

    const getReport = async () => {
        if(keyword === '') {
            showToast("조희할 수 없는 정보입니다", "error");
            return;
        }

        try {            
            const response = await getData(`/report?keyword=${keyword}`); 
            if(response.status === 200) {
                setReportInfo(response.data);
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
 
    return (
    <main>
        <form>
        <div className="report-search-wrapper">
            <h3>안전한 거래를 위한 한 걸음</h3>
            <div className="report-search-box">
                <FaSearch size={20} color="#777" />
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
        </div>
        </form>

        {reportInfo && 
        <div className="report-result-wrapper">
            <div>
                
            </div>
        </div>
        }
    </main>
    );
};

export default Report;