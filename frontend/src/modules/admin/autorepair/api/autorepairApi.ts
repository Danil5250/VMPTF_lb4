
import api from "../../../main-api/api.ts";

const baseUrl = "autorepairs-admin";

export interface Autorepair {
    autorepair_id?: number;
    name: string;
    description?: string;
    adress?: string;
    index?: string;
    workers_amount?: number;
    phone?: string;
    email?: string;
    ranking?: number;
    password?: string;
}

export const fetchAllAutorepairs = async (): Promise<Autorepair[]> => {
    try {
        const result = await api.get(baseUrl);
        return result.data;
    } catch (error) {
        console.error("Error fetching autorepairs:", error);
        return [];
    }
};

export const fetchAutorepairById = async (id: number): Promise<Autorepair | null> => {
    try {
        const result = await api.get(`${baseUrl}/${id}`);
        return result.data;
    } catch (error) {
        console.error(`Error fetching autorepair with id ${id}:`, error);
        return null;
    }
};

export const createAutorepair = async (data: Autorepair): Promise<Autorepair | null> => {
    try {
        const result = await api.post(baseUrl, data);
        return result.data;
    } catch (error) {
        console.error("Error creating autorepair:", error);
        return null;
    }
};

export const updateAutorepair = async (id: number, data: Autorepair): Promise<Autorepair | null> => {
    try {
        const result = await api.put(`${baseUrl}/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(`Error updating autorepair with id ${id}:`, error);
        return null;
    }
};

export const deleteAutorepair = async (id: number): Promise<void> => {
    try {
        await api.delete(`${baseUrl}/${id}`);
    } catch (error) {
        console.error(`Error deleting autorepair with id ${id}:`, error);
    }
};
