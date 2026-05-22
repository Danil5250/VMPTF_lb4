import api from "../../main-api/api.ts";


const baseUrl = `serviceCategory`;

export const getAllCategoryServices = async() => {
    try {
        const result = await api.get(baseUrl);
        return result.data;
    }
    catch (error) {
        console.error(`an error occurred receiving categories of services${error}`);
    }
}


