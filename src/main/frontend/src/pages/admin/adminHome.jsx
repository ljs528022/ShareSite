import { useEffect } from "react";
import { getUserInfo } from "../../services/getUserInfo";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../util/ToastContext";

const AdminHome = () => {

    const { user } = getUserInfo();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // 어드민이 아니면 Home으로 이동시키기
    // useEffect(() => {
    //     if(!user) {
    //         navigate("/admin/login");
    //     }

    //     if(user.auth !== "ADMIN") {
    //         alert("관리자 외에는 접근불가 입니다! Home으로 이동합니다");
    //         navigate("/home");
    //     } else {
    //         showToast("어서오십쇼. 관리자님");
    //     }
    // });

    return (
        <main>
            {/* 관리자 페이지 사이드 바 */}
            <div className="">

            </div>
        </main>
    );
}

export default AdminHome;
