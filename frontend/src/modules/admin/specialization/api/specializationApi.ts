
import api from "../../../main-api/api.ts";

const baseUrl = "specialization-admin";

export interface Specialization {
    specialtion_id?: number;
    name: string;
}

export const fetchAllSpecializations = async (): Promise<Specialization[]> => {
    try {
        const result = await api.get(baseUrl);
        return result.data;
    } catch (error) {
        console.error("Error fetching specializations:", error);
        return [];
    }
};

export const createSpecialization = async (data: Specialization): Promise<Specialization | null> => {
    try {
        const result = await api.post(baseUrl, data);
        return result.data;
    } catch (error) {
        console.error("Error creating specialization:", error);
        return null;
    }
};

export const updateSpecialization = async (id: number, data: Specialization): Promise<Specialization | null> => {
    try {
        const result = await api.put(`${baseUrl}/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(`Error updating specialization with id ${id}:`, error);
        return null;
    }
};

export const deleteSpecialization = async (id: number): Promise<void> => {
    try {
        await api.delete(`${baseUrl}/${id}`);
    } catch (error) {
        console.error(`Error deleting specialization with id ${id}:`, error);
    }
};
