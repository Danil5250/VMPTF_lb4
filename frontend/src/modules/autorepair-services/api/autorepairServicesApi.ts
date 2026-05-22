import api from "../../main-api/api.ts";
import type {
    Service,
    AutorepairService,
    CreateAutorepairServiceData,
    UpdateAutorepairServiceData
} from "../interfaces/AutorepairService.ts";

const baseUrl = 'autorepair-services';

export const getAllServices = async (): Promise<Service[] | []> => {
    try {
        const result = await api.get<Service[]>(baseUrl);
        return result.data;
    }
    catch (error) {
        console.log(`Error occurred receiving the services ${error}`);
        return [];
    }
}

export const getAutorepairServices = async (autorepairId: number): Promise<AutorepairService[]> => {
    try {
        const result = await api.get(`${baseUrl}/autorepair/${autorepairId}`);
        return result.data;
    } catch (error) {
        console.error(`Error fetching autorepair services: ${error}`);
        throw error;
    }
};

export const createAutorepairService = async (
    data: CreateAutorepairServiceData
): Promise<AutorepairService> => {
    try {
        const result = await api.post(`${baseUrl}/autorepair`, data);
        return result.data;
    } catch (error) {
        console.error(`Error creating autorepair service: ${error}`);
        throw error;
    }
};

export const updateAutorepairService = async (
    id: number,
    data: UpdateAutorepairServiceData
): Promise<AutorepairService> => {
    try {
        const result = await api.put(`${baseUrl}/autorepair/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(`Error updating autorepair service: ${error}`);
        throw error;
    }
};

export const deleteAutorepairService = async (id: number): Promise<void> => {
    try {
        await api.delete(`${baseUrl}/autorepair/${id}`);
    } catch (error) {
        console.error(`Error deleting autorepair service: ${error}`);
        throw error;
    }
};
