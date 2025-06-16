import { useEffect, useState } from "react";
import { useUser } from "../services/UserContext";
import "../css/pages/report.css";
import { Dropdown } from "react-bootstrap";

const WriteReport = () => {

    const reporter = useUser();
    const [ target, setTarget ] = useState(null);
    const [ confirm, setConfirm ] = useState(false);

    const [ reportInfo, setReportInfo ] = useState({
        reporterKey: null,
        targetKey: null,
        reason: 0,
        content: "",
        img: [],
    });

    useEffect(() => {
        const reportTarget = sessionStorage.getItem("report-target");
        if(reportTarget) {
            const targetInfo = JSON.parse(reportTarget);
            setTarget(targetInfo);
        }
    }, []);

    const addAttachment = (e) => {
        const files = Array.from(e.target.file);

        e.target.value = null;

        setReportInfo(prev => ({ ...prev, img: [...prev.img, ...files]}))
    }

    const handleDeleteImage = (index) => {
        setReportInfo(prev => {
            const newImgList = prev.img.filter((_,idx) => idx !== index);

            return {
                ...prev,
                img: newImgList
            }
        });
    };

    if(!target) return;

    return (
        <main>
            <form>
            <h3 style={{marginTop: "50px"}}>신고 접수</h3>
            <div className="report-wrapper">
                <div className="report-box">
                    <p>신고 대상 : <strong>{target.useralias}</strong></p>
                </div>
                <div className="report-box">
                    <p>신고 사유 :</p>
                    <select value={reportInfo.reason} onChange={(e) => setReportInfo(prev => ({...prev, reason: e.target.value}))}>
                        <option value={0}>-- 신고 사유 선택 --</option>
                        <option value={1}>거래 불이행 </option>
                        <option value={2}>허위 매물 등록</option>
                        <option value={3}></option>
                        <option value={4}>-- 신고 사유 선택 --</option>
                    </select>
                </div>
                <div className="report-box">
                    <p>신고 내용 :</p>
                    
                </div>
                <div className="report-box">
                    <p>첨부파일 :
                        <button type="file" accept="image/*" multiple onChange={addAttachment}>추가</button>
                    </p>

                </div>
            </div>
            </form>
        </main>
    )
}

export default WriteReport;