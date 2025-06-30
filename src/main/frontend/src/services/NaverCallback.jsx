import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { postData } from "./api";
import { useToast } from "../util/ToastContext";

const NaverCallback = () => {
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

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
                const res = await postData("/oauth/naver/callback", {
                    code,
                    state
                });
                const data = res.data;

                if(data.token) {
                    sessionStorage.setItem("token", data.token);
                    navigate("/home");
                    showToast("어서오세요! 환영합니다!");
                } else {
                    // 회워가입 유도 정보
                    navigate("/user/register/social", { state: res.data });
                }
            } catch (err) {
                alert("네이버 로그인 실해");
                console.log(err);
            }
        }

        fetchLogin();
    }, [])
}

export default NaverCallback;