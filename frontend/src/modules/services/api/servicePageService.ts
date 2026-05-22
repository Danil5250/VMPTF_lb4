import api from "../../main-api/api.ts";
import type { ServiceFormData } from "../interfaces/ServiceFormData.ts";
import type { Client } from "../../clients/interfaces/Client.ts";
import type { Service } from "../interfaces/Service.ts";



const baseURL = 'services'


interface GetFilteredServicesParams {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minWarranty?: string;
    maxWarranty?: string;
    minDuration?: string;
    maxDuration?: string;
    sortBy?: 'name' | 'basePrice' | 'duration' | 'warranty';
    sortOrder?: 'ASC' | 'DESC';
    limit?: string;
    offset?: string;
}



export const getFilteredServices = async (params: GetFilteredServicesParams) => {
    const queryParams = new URLSearchParams();

    // Додаємо тільки задані параметри
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
        }
    });

    try {
        const response = await api.get(`/${baseURL}?${queryParams}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
}



export const getServicesStatistic = async () => {
    return await api.get(`/${baseURL}/allClientStatistics`);
}


export const getAllServices = async () => {
    try {
        const result = await api.get(baseURL);
        console.log(result.data);
        return result.data;
    }
    catch (error) {
        console.error(`An error occurred receiving the services: ${error}`);
    }
}

export const getServicesFiltersMax = async () => {
    return await api.get(`${baseURL}/getServicesFiltersMax`);
}

export const deleteService = async (id: number) => {
    try {
        const result = await api.delete(`${baseURL}/${id}`);
        console.log(result);
        return result;
    }
    catch (error) {
        console.error(`Error deleting service: ${error}`);
    }
}
