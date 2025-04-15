import { getData } from "./api"

export const getCategory = async () => {
    try {
        const data = await getData("/api/category");
        return data;
    } catch (err) {
        console.log("Failed to fetch categories:", err);
        return [];
    }
}