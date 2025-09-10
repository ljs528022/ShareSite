import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../util/ToastContext";
import { useUser } from "./UserContext";
import { useEffect } from "react";
import { getData, postData } from "./api";
import { getUserInfo } from "./getUserInfo";

const KakaoCallback = () => {
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { setUser } = useUser();

    useEffect(() => {
        const code = searchParams.get("code");

        const fetchLogin = async () => {
            try {
                const res = await getData(`/oauth/kakao/callback?code=${code}`);
                const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

                if(data.registerRequired) {
                    sessionStorage.setItem("kakaoAccessToken", data.accessToken);
                    navigate("/user/signup/social", {
                        state: {
                            email: data.email,
                            name: data.name,
                            id: data.kakaoId,
                        }
                    });
                } else if (data.token) {
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("kakaoAccessToken", data.accessToken);

                    const userInfo = await getUserInfo();
                    const userState = userInfo.state;

                    if(userState === "N") {
                        setUser(userInfo);
                        showToast("로그인 성공! 카카오에서 오신걸 환영합니다!");
                        navigate("/");
                    } else if (userState === "R") {
                        const result = confirm("탈퇴 처리 중인 계정입니다. 탈퇴를 취소하겠습니까?");
                        const accessToken = sessionStorage.getItem("kakaoAccessToken");
                        if(result) {
                            const res = await postData("/user/cancel-socialWithdraw", {
                                userKey: userInfo.userKey,
                                accessToken: accessToken,
                            });
                            if(res.status === 200) {
                                setUser(userInfo);
                                showToast(`탈퇴 요청이 취소되었습니다. ${userInfo?.useralias}님 어서오세요!`);
                                navigate("/");
                            }
                        } else {
                            showToast("로그인이 중단되었습니다. Home으로 이동합니다.", "error");
                            sessionStorage.removeItem("kakaoAccessToken");
                            navigate("/");
                        }
                    } else if (userState === "S") {
                        confirm("이미 탈퇴 처리된 계정입니다. Home으로 이동합니다.");
                        localStorage.removeItem("token");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("kakaoAccessToken");
                        navigate("/");
                    }
                } else {
                    showToast("알 수 없는 응답입니다", "error");
                    localStorage.removeItem("naver-state");
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("kakaoAccessToken");
                    return;
                }
            } catch {
                showToast("카카오 로그인에 실패했습니다...", "error");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("kakaoAccessToken");
            }
        };
        fetchLogin();
    }, []);

    return (
        <main>
            <div
            style={{
                margin: "20px auto",
                width: "400px",
                textAlign: "center",
            }}
            >카카오 로그인 처리 중...잠시만 기다려주세요!</div>
        </main>
    );
}

export default KakaoCallback;