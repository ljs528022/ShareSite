import { useState } from "react";
import { useToast } from "../util/ToastContext";
import { getData } from "../services/api";

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
            }
        } catch {
            showToast("통신 장애가 발생했습니다..!", "error");
        }
    }

    return (
    <main>
        <form>
        <div>
            <h3>안전한 거래를 위한 한 걸음</h3>
            <div>
                <label>사기 조회</label>

                <input />
            </div>
        </div>
        </form>
    </main>
    );
};

export default Report;