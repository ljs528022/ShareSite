import { useEffect, useState } from "react";
import { useUser } from "../services/UserContext";
import "../css/pages/report.css";
import { FaXmark } from "react-icons/fa6";
import { useToast } from "../util/ToastContext";
import { postData } from "../services/api";
import { useNavigate } from "react-router-dom";

const WriteReport = () => {

    const { user } = useUser();
    const [ target, setTarget ] = useState(null);
    const [ confirm, setConfirm ] = useState(false);

    const { showToast } = useToast();
    const navigate = useNavigate();

    const [ reportInfo, setReportInfo ] = useState({
        reporterKey: null,
        targetKey: null,
        reason: "0",
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

    const handleChangeValue = (e) => {
        const { id, value } = e.target;

        setReportInfo(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const addAttachment = (e) => {
        const files = Array.from(e.target.files);
        const newImg = files.map(file => ({ file }));

        e.target.value = null;

        setReportInfo(prev => ({ ...prev, img: [...prev.img, ...newImg]}))
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
    
    const handleSubmit = async () => {
        if(!user && !target) return;
        if(reportInfo.reason === "0" || reportInfo.content === "") {
            showToast("어떤 항목이 입력되지 않았습니다. 확인해주세요", "error");
            return;
        }

        const report = ({
            reporterKey: user.userKey,
            targetKey: target.userKey,
            reason: reportInfo.reason,
            content: reportInfo.content,
        });
        
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        try {
            const response = await postData("/report/write", report, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if(response.status === 200) setConfirm(true);
        } catch {
            showToast("통신 장애가 발생했습니다", "error")
        }


    }

    if(!target) return;

    return (
        
        <main>
            {!confirm ?
            <>
            <h3 style={{marginTop: "50px"}}>신고 접수</h3>
            <div className="report-wrapper">
                <div className="report-box">
                    <p>신고 대상 : <strong>{target.useralias}</strong></p>
                </div>
                <div className="report-box">
                    <p>신고 사유 :</p>
                    <select className="report-select" id="reason" value={reportInfo.reason} onChange={handleChangeValue}>
                        <option value={0}>{"-- 신고 사유 선택 --"}</option>
                        <option value={1}>{"거래 불이행"}</option>
                        <option value={2}>{"허위 매물 등록"}</option>
                        <option value={3}>{"정보 도용 의심"}</option>
                        <option value={4}>{"욕설 및 비난"}</option>
                        <option value={5}>{"협박 및 무리한 요구"}</option>
                        <option value={6}>{"기타 사유(직접 작정)"}</option>
                    </select>
                </div>
                <div className="report-box">
                    <p>신고 내용 :</p>
                    <textarea id="content" className="report-textarea" onChange={handleChangeValue}/>
                </div>
                <div className="report-box">
                    <p>첨부파일 :
                        <label className="report-img" htmlFor="img">추가</label>
                        <input id="img" type="file" accept="image/*" multiple onChange={addAttachment} style={{display: "none"}}/>
                    </p>
                    <div className="report-imgList">
                        {reportInfo.img.length > 0 &&
                        reportInfo.img.map((img, index) => (
                            <div key={index} className="report-imgBox">
                                <span className="report-img-delBtn" onClick={() => handleDeleteImage(index)}>
                                    <FaXmark size={15} color="red" />
                                </span>
                                <img src={URL.createObjectURL(img.file)} alt={`첨부이미지-${index}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="report-box">
                    <button className="report-submit" type="button" onClick={handleSubmit}>제출</button>
                </div>
            </div>
            </>
            :
            <div className="report-confirm">
                <h3>신고가 접수되었습니다!</h3>
                <div className="report-confirm-box">
                    <p>{`빠른 시일 내에 조치를 취하겠습니다.`}</p>
                    <p>{`신고해주셔서 감사합니다!`}</p>
                    <button onClick={() => navigate("/")}>Home 으로 이동</button>
                </div>
            </div>
            }
        </main>
    )
}

export default WriteReport;