import api from "../../../main-api/api.ts";
import type { ServiceFormData } from "../interfaces/ServiceFormData.ts";
import type { Client } from "../../clients/interfaces/Client.ts";
import type { Service } from "../interfaces/Service.ts";



const baseURL = 'services'

export const getAllServices = async () => {
    try {
        const result = await api.get(`${baseURL}/all`);
        console.log(result.data);
        return result.data.services;
    }
    catch (error) {
        console.error(`An error occurred receiving the services: ${error}`);
    }
}

export const getServiceById = async (id: string) => {
    try {
        const result = await api.get(`${baseURL}/getServiceById/${id}`);
        console.log(result.data);
        return result.data;
    }
    catch (error) {
        console.error(`An error occurred receiving the services: ${error}`);
    }
}

export const addService = async (service: ServiceFormData) => {
    try {
        return await api.post(baseURL, service);
    }
    catch (err) {
        console.error(`Error occurred adding a client: ${err}`);
        return [];
    }
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

export const updateService = async (id: string, service: Service) => {
    try {
        return await api.put(`${baseURL}/${id}`, service)
    }
    catch (err) {
        console.error(`Error occurred updating client: ${err}`);
    }
}

export const getCategoryServices = async () => {
    return await api.get(`serviceCategory`);
}