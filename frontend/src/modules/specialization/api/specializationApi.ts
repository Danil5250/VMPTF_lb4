import api from "../../main-api/api.ts";
import type {
    Specialization,
    AutorepairSpecialization,
    CreateAutorepairSpecializationData,
    UpdateAutorepairSpecializationData
} from "../interfaces/AutorepairSpecialization.ts";

const baseUrl = 'specializations'

export const getAllSpecializations = async (): Promise<Specialization[] | []> => {
    try {
        const result = await api.get<Specialization[]>(baseUrl);
        return result.data;
    }
    catch (error) {
        console.log(`Error occurred receiving the specializations ${error}`);
        return [];
    }
}

export const getAutorepairSpecializations = async (autorepairId: number): Promise<AutorepairSpecialization[]> => {
    try {
        const result = await api.get(`${baseUrl}/autorepair/${autorepairId}`);
        return result.data;
    } catch (error) {
        console.error(`Error fetching autorepair specializations: ${error}`);
        throw error;
    }
};

export const createAutorepairSpecialization = async (
    data: CreateAutorepairSpecializationData
): Promise<AutorepairSpecialization> => {
    try {
        const result = await api.post(`${baseUrl}/autorepair`, data);
        return result.data;
    } catch (error) {
        console.error(`Error creating autorepair specialization: ${error}`);
        throw error;
    }
};

export const updateAutorepairSpecialization = async (
    id: number,
    data: UpdateAutorepairSpecializationData
): Promise<AutorepairSpecialization> => {
    try {
        const result = await api.put(`${baseUrl}/autorepair/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(`Error updating autorepair specialization: ${error}`);
        throw error;
    }
};

export const deleteAutorepairSpecialization = async (id: number): Promise<void> => {
    try {
        await api.delete(`${baseUrl}/autorepair/${id}`);
    } catch (error) {
        console.error(`Error deleting autorepair specialization: ${error}`);
        throw error;
    }
};
