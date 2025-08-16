import { postData } from "../../services/api";

const authProvider = {
    login: async ({ username, password }) => {
        let token = sessionStorage.getItem("token");
        const userData = {
            username: username,
            password: password,
        };
        
        if(!token) {
            const { data } = await postData("/user/login", userData);
            const token = data.token;
            sessionStorage.setItem("token", token);
        }

        return Promise.resolve();
    },
    logout: () => {
        sessionStorage.removeItem("token");
        return Promise.resolve();
    },
    checkAuth: () => {
        const token = sessionStorage.getItem("token");
        return token 
            ? Promise.resolve() 
            : Promise.reject({ message: "로그인이 필요합니다." });
    },
}

export default authProvider;