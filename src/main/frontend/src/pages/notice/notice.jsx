import { useEffect, useState } from "react";
import { useToast } from "../../util/ToastContext";
import { getData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../css/pages/notice.css";

const Notice = () => {

    const [ notices, setNotices ] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await getData("/notice");
                if(response.status === 200) {
                    const { notices } = response.data;
                    setNotices(notices);
                }
            } catch {
                showToast("통신 중 에러가 발생했습니다.", "error");
            }
        };
        fetchNotice();
    }, []);

    if(!notices) return;

    return (
    <main>
        <div className="notice-wrapper">
            <h3 style={{marginTop: "30px"}}>공지사항</h3>
            <table className="notice-table">
                <thead>
                    <tr>
                        <th>종류</th>
                        <th>제목</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((n, index) => (
                        <tr key={n.noticeKey || index} style={{cursor: "pointer"}} onClick={() => navigate(`/notice/${n.noticeKey}`)}>
                            <td>{n.noticeType === 0 ? "공지" : "알림"}</td>
                            <td>{`${n.subject}`}</td>
                            <td>{`${n.writeDate}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </main>
    );
}

export default Notice;