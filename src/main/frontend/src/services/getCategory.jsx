import { getData } from "./api"

export const getCategory = async () => {
    try {
        const data = await getData("/category");
        return data;
    } catch (err) {
        console.log("Failed to fetch categories:", err);
        return [];
    }
}