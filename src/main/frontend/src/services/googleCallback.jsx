import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "./getUserInfo";
import { useUser } from "./UserContext";
import { useToast } from "../util/ToastContext";
import { postData } from "./api";

const GoogleCallback = () => {

    const { setUser } = useUser();

    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchAndLogin = async () => {
            try {
                const res = await fetch("http://localhost:8093/api/auth/check-login", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();

                if(data.token) {
                    sessionStorage.setItem("token", data.token);

                    const userInfo = await getUserInfo();
                    const userState = userInfo.state;

                    if(userState === "N") {
                        setUser(userInfo);
                        showToast("로그인 성공! 구글에서 오신걸 환영합니다!");
                        navigate('/');
                    } else if (userState === "R") {
                        const result = confirm("탈퇴 처리 중인 계정입니다. 탈퇴를 취소하겠습니까?");
                        
                        if(result) {
                            const res = await postData("/user/cancel-socialWithdraw", {
                                userKey: userInfo.userKey
                            });
                            if(res.status === 200) {
                                setUser(userInfo);
                                showToast(`탈퇴 요청이 취소되었습니다. ${userInfo?.useralias}님 어서오세요.`);
                                navigate("/");
                            }
                        } else {
                            showToast("로그인이 중단되었습니다. Home으로 이동합니다.", "error");
                            navigate("/");
                        }
                    } else {
                        showToast("알 수 없는 응답입니다", "error");
                        localStorage.removeItem("token");
                        sessionStorage.removeItem("token");
                    }
                }
            } catch {
                showToast("구글 로그인에 실패했습니다...", "error");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
            }
        };
        
        fetchAndLogin();
    }, []);
}

export default GoogleCallback;