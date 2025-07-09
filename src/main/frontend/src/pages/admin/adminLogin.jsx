import { useState } from "react";
import { postData } from "../../services/api";
import { useUser } from "../../services/UserContext";

const AdminLogin = () => {

    const { user, setUser } = useUser();

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

            </form>
        </main>
    );
}

export default AdminLogin;