
import api from "../../../main-api/api.ts";

const baseUrl = "admin/specialization-autorepairs";

export interface SpecializationAutorepair {
    specialtion_autorepair_id?: number;
    model?: string;
    engine_type?: string;
    year?: number;
    autorepair_id: number;
    autorepair_name?: string;
    specialtion_id: number;
    specialization_name?: string;
}

export interface AutorepairOption {
    autorepair_id: number;
    name: string;
}

export interface SpecializationOption {
    specialtion_id: number;
    name: string;
}

export const fetchAllSpecializationAutorepairs = async (): Promise<SpecializationAutorepair[]> => {
    try {
        const result = await api.get(baseUrl);
        return result.data;
    } catch (error) {
        console.error("Error fetching specialization-autorepairs:", error);
        return [];
    }
};

export const fetchAutorepairOptions = async (): Promise<AutorepairOption[]> => {
    try {
        const result = await api.get(`${baseUrl}/autorepairs`);
        return result.data;
    } catch (error) {
        console.error("Error fetching autorepair options:", error);
        return [];
    }
};

export const fetchSpecializationOptions = async (): Promise<SpecializationOption[]> => {
    try {
        const result = await api.get(`${baseUrl}/specializations`);
        return result.data;
    } catch (error) {
        console.error("Error fetching specialization options:", error);
        return [];
    }
};

export const createSpecializationAutorepair = async (data: SpecializationAutorepair): Promise<SpecializationAutorepair | null> => {
    try {
        const result = await api.post(baseUrl, data);
        return result.data;
    } catch (error) {
        console.error("Error creating specialization-autorepair:", error);
        return null;
    }
};

export const updateSpecializationAutorepair = async (id: number, data: Partial<SpecializationAutorepair>): Promise<SpecializationAutorepair | null> => {
    try {
        const result = await api.patch(`${baseUrl}/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(`Error updating specialization-autorepair with id ${id}:`, error);
        return null;
    }
};

export const deleteSpecializationAutorepair = async (id: number): Promise<void> => {
    try {
        await api.delete(`${baseUrl}/${id}`);
    } catch (error) {
        console.error(`Error deleting specialization-autorepair with id ${id}:`, error);
    }
};
