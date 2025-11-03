import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "./getUserInfo";

const UserContext = createContext({
    user: null,
    setUser: () => {},
    loading: true
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err) {
                const status = err.response?.status;

                if(status === 401 || status === 500) {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    alert("시간이 너무 지나서 자동 로그아웃 되었어요! 다시 로그인 해주세요!");
                    window.location.href = "/user/login";
                }

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if(token) {
            fetchUser();
        } else {
            setLoading(false);
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);