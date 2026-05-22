import api from "../../../main-api/api.ts";

const baseUrl = 'cars'

export const getAllCars = async () => {
    return await api.get(`/${baseUrl}/all`);
}

export const getCarById = async (id: number) => {
    return await api.get(`/${baseUrl}/${id}`);
}

export const createCar = async (data: any) => {
    return await api.post(`/${baseUrl}`, data);
}

export const updateCar = async (id: number, data: any) => {
    return await api.put(`/${baseUrl}/${id}`, data);
}

export const deleteCar = async (id: number) => {
    return await api.delete(`/${baseUrl}/${id}`);
}