import api from "../../../main-api/api.ts";
import type { AutorepairService, AutorepairForSelect, ServiceForSelect } from "../types.ts";

const baseUrl = `autorepair-services-admin`
const oldBaseUrl = `autorepair-services`

export const getAutorepairsServices = async (autorepairId: number) => {
    return await api.get(`${oldBaseUrl}/autorepair/${autorepairId}`)
}


export const fetchAllAutorepairServices = async (): Promise<AutorepairService[]> => {
    const response = await api.get(`${baseUrl}`);
    return response.data;
}

export const fetchOneAutorepairService = async (id: number): Promise<AutorepairService> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
}

export const addAutorepairService = async (data: Partial<AutorepairService>) => {
    const response = await api.post(`${baseUrl}`, data);
    return response.data;
}

export const updateAutorepairService = async (id: number, data: Partial<AutorepairService>) => {
    const response = await api.patch(`${baseUrl}/${id}`, data);
    return response.data;
}

export const deleteAutorepairService = async (id: number) => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
}

export const fetchAutorepairsForSelect = async (): Promise<AutorepairForSelect[]> => {
    const response = await api.get(`${baseUrl}/autorepairs-select`);
    return response.data;
}

export const fetchServicesForSelect = async (): Promise<ServiceForSelect[]> => {
    const response = await api.get(`${baseUrl}/services-select`);
    return response.data;
}