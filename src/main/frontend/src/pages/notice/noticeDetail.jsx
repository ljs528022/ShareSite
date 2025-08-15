import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../util/ToastContext";
import { getData } from "../../services/api";
import "../../css/pages/notice.css";

const NoticeDetail = () => {
    const { noticeKey } = useParams();

    const [ notice, setNotice ] = useState(null);

    const { showToast } = useToast();

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await getData(`/notice/${noticeKey}`);
                if(response.status === 200) {
                    const { notice } = response.data;
                    setNotice(notice);
                };
            } catch {
                showToast("통신 중에 에러가 발생했습니다", "error");
            }
        }
        fetchNotice();
    }, [noticeKey]);

    const renderTime = (time) => {
        if(!time) return "";

        return new Date(time).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const renderNoticeType = (noticeType) => {
        if(noticeType) return undefined;

        return noticeType === 0 ? "공지" : "알림"
    };

    if(!notice) return;

    return (
    <main>
        <div className="notice-detail">
            <h2 className="notice-title">{`[ ${renderNoticeType(notice.noticeType)} ] ${notice.subject}`}</h2>
            <div className="notice-meta">
                <span>{renderTime(notice.writeDate)}</span>
            </div>
            <div className="notice-content">
                <pre>{notice.content}</pre>
            </div>
            <div className="notice-action">
                <a href="/notice" className="btn">목록으로</a>
            </div>
        </div>
    </main>
    );
}

export default NoticeDetail;