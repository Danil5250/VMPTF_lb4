import api from "../../main-api/api.ts";

const baseUrl = `clients`;

interface Car {
    brand: string;

    model: string;

    engineType: string;

    year: number;

    insuranceExpiry?: string;

    licensePlate?: string;

    vin?: string;
}


export async function fetchUser() {
    const res = await api.get(`/${baseUrl}/user`,
        { withCredentials: true });
    return res.data;
}

export async function logoutUser() {
    try {
        const res = await api.get(`/${baseUrl}/logout`,
            { withCredentials: true })
        return res.data;
    } catch {
        return null;
    }
}


export const getAllVisitsByClientId = async (clientId: string) => {
    return await api.get(`/${baseUrl}/clientsVisits/${clientId}`);
}

export const getAllCarsByClientId = async (clientId: string) => {
    return await api.get(`/${baseUrl}/getCarsByClientId/${clientId}`);
}

export const addCarByClientId = async (car: Car, clientId: number) => {
    return await api.post(`/${baseUrl}/addCarToClient/${clientId}`, car);
}

export const getClientInfoByClientId = async (clientId: number) => {
    return await api.get(`/${baseUrl}/getClientById/${clientId}`);
}



export const getCarSpecializations = async (filters: { brand?: string; model?: string; engine_type?: string } = {}) => {
    const response = await api.get(`/specializations/allSpecializationsAutorepair`);
    const data = response.data;

    return {
        brands: [...new Set(data.map(i => i.brand))],
        models: [...new Set(data.filter(i => !filters.brand || i.brand === filters.brand).map(i => i.model))],
        engineTypes: [...new Set(data.filter(i =>
            (!filters.brand || i.brand === filters.brand) &&
            (!filters.model || i.model === filters.model)
        ).map(i => i.engine_type))],
        years: [...new Set(data.filter(i =>
            (!filters.brand || i.brand === filters.brand) &&
            (!filters.model || i.model === filters.model) &&
            (!filters.engine_type || i.engine_type === filters.engine_type)
        ).map(i => i.year))]
    };
}


