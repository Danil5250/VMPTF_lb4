import api from "../../../main-api/api.ts";

const baseUrl: string = "visits-services-admin";

export const fetchAllVisitServices = async () => {
    try {
        const result = await api.get(baseUrl);
        return result.data;
    } catch (error) {
        console.error("An error occurred receiving visit services: ", error);
        return [];
    }
};

export const fetchVisitServiceById = async (id: number) => {
    try {
        const result = await api.get(`${baseUrl}/${id}`);
        return result.data;
    } catch (error) {
        console.error("An error occurred receiving visit service by id: ", error);
        return null;
    }
};

export const addVisitService = async (data: any) => {
    try {
        return await api.post(baseUrl, data);
    } catch (error) {
        console.error("An error occurred adding visit service: ", error);
    }
};

export const updateVisitService = async (id: number, data: any) => {
    try {
        return await api.patch(`${baseUrl}/${id}`, data);
    } catch (error) {
        console.error("An error occurred updating visit service: ", error);
    }
};

export const deleteVisitService = async (id: number) => {
    try {
        return await api.delete(`${baseUrl}/${id}`);
    } catch (error) {
        console.error("An error occurred deleting visit service: ", error);
    }
};

export const fetchVisitsForSelect = async () => {
    try {
        const result = await api.get(`${baseUrl}/visits-select`);
        return result.data;
    } catch (error) {
        console.error("Error fetching visits for select:", error);
        return [];
    }
};

export const fetchAutorepairServicesForSelect = async () => {
    try {
        const result = await api.get(`${baseUrl}/autorepair-services-select`);
        return result.data;
    } catch (error) {
        console.error("Error fetching autorepair services for select:", error);
        return [];
    }
};
