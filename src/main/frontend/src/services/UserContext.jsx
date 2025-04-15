import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "./getUserInfo";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err) {
                if(err.response?.status === 401) {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    setUser(null);
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