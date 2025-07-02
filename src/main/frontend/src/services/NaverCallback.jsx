import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../util/ToastContext";
import { useEffect } from "react";
import { getData } from "./api";
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
                    navigate("/user/signup/social", {
                        state: {
                            email: data.email,
                            name: data.name,
                            id: data.naverId,
                            accessToken: data.accessToken
                        }
                    });
                } else if (data.token) {
                    sessionStorage.setItem("token", data.token);

                    const userInfo = await getUserInfo();

                    const userState = userInfo.state;
                    if(userState === "N") {
                        setUser(userInfo);
                        showToast(`로그인 성공! 네이버에서 오신걸 환영합니다!`);
                        navigate("/home");
                    }
                } else {
                    showToast("알 수 없는 응답입니다", "error");
                    localStorage.removeItem("naver-state");
                }
            } catch (err) {
                showToast("네이버 로그인에 실패했습니다...", "error");
                localStorage.removeItem("naver-state");
                console.log(err);
            }
        }

        fetchLogin();
    }, []);

    return <div>네이버 로그인 처리 중입니다...</div>;
}

export default NaverCallback;