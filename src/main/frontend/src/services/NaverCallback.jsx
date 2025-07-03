import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../util/ToastContext";
import { useEffect } from "react";
import { getData, postData } from "./api";
import { getUserInfo } from "./getUserInfo";
import { useUser } from "./UserContext";

const NaverCallback = () => {
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { setUser } = useUser();

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        const storedState = localStorage.getItem("naver_state");
        if(state !== storedState) {
            alert("잘못된 요청입니다.");
            return;
        }

        const fetchLogin = async () => {
            try {
                const res = await getData(`/oauth/naver/callback?code=${code}&state=${state}`);
                const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

                if(data.registerRequired) {
                    sessionStorage.setItem("naverAccessToken", data.accessToken);
                    navigate("/user/signup/social", {
                        state: {
                            email: data.email,
                            name: data.name,
                            id: data.naverId,
                        }
                    });
                } else if (data.token) {
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("naverAccessToken", data.accessToken);

                    const userInfo = await getUserInfo();
                    const userState = userInfo.state;

                    if(userState === "N") {
                        setUser(userInfo);
                        showToast(`로그인 성공! 네이버에서 오신걸 환영합니다!`);
                        navigate("/home");
                    } else if (userState === "R") {
                        const result = confirm("탈퇴 처리 중인 계정입니다. 탈퇴를 취소하겠습니까?");
                        const accessToken = sessionStorage.getItem("naverAccessToken");
                        if(result) {
                            const res = await postData("/user/cancel-socialWithdraw", {
                                userKey: userInfo.userKey,
                                accessToken: accessToken,
                            });
                            if(res.status === 200) {
                                setUser(userInfo);
                                showToast(`탈퇴 요청이 취소되었습니다. ${userInfo?.useralias}님 어서오세요!`);
                                navigate("/home");
                            }
                        } else {
                            showToast("로그인이 중간되었습니다. Home으로 이동합니다.", "error");
                            sessionStorage.removeItem("naverAccessToken");
                            navigate("/home");
                        }
                    } else if (userState === "S") {
                        confirm("이미 탈퇴 처리된 계정입니다. Home으로 이동합니다.");
                        localStorage.removeItem("token");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("naverAccessToken");
                        navigate("/home");
                    }
                } else {
                    showToast("알 수 없는 응답입니다", "error");
                    localStorage.removeItem("naver-state");
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("naverAccessToken");
                    return;
                }
            } catch (err) {
                showToast("네이버 로그인에 실패했습니다...", "error");
                localStorage.removeItem("naver-state");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("naverAccessToken");
                console.log(err);
            }
        };
        fetchLogin();
    }, []);

    return <div>네이버 로그인 처리 중입니다...</div>;
}

export default NaverCallback;