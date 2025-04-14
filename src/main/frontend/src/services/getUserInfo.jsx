import api from "./api";


export const getUserInfo = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if(!token) {
        throw new Error("No Token Found...");
    }

    try {
        const res = await api.get("/user/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        console.log("Failed To Fetch User Info...", err);
        throw err;
    }
};