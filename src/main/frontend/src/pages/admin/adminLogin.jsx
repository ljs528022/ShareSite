import { useState } from "react";
import { postData } from "../../services/api";
import { useUser } from "../../services/UserContext";

const AdminLogin = () => {
    const [loginData, setLoginData] = useState({
        id: "",
        password: ""
    });

    const handleInput = (e) => {
        const { id, value } = e.target;
        setLoginData(prev => ({ ...prev, [id]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await postData("/admin/login", {
                username: loginData.id,
                password: loginData.password,
            });
            if(res.status === 200) {
                setUser(res.data);
            }
        } catch {
            alert("통신 중에 오류가 발생했습니다.");
        }
    }

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <label>관리자 로그인</label>
                <input id="id" type="text" placeholder="id 입력" onChange={handleInput} />
                <input id="password" type="password" placeholder="pw 입력" onChange={handleInput} />
                <button type="button" onClick={handleSubmit}>Login</button>
            </form>
        </main>
    );
}

export default AdminLogin;