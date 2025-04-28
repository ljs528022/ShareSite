import api from "./api";

export const getUserInfo = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if(!token) {
        console.log("No Token Found...Skipping /user/me Request!")
        return null;
    }

    try {
        const res = await api.get("/api/profile", {
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