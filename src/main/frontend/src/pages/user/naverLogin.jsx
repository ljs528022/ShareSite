import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const NaverLogin = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const savedState = localStorage.getItem("naver_auth_state");

        if(state !== savedState) {
            alert("위조된 요청입니다!");
            return;
        }

        fetch("http://localhost:8093/user/naver-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, state }),

        })
        .then(res => res.json())
        .then(data => {
            if(data.isNewUser) {
                navigate("")
            } else {
                sessionStorage.setItem("token", data.token);
                navigate("/home");
            }
        })
    }, []);
}