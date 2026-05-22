import api from "../../../main-api/api.ts";
import type { Service } from "../../services/interfaces/Service.ts";
import type { OnlyVisit } from "../interfaces/OnlyVisit.ts";
import type { Visit } from "../interfaces/VisitUpdate.ts";

const baseUrl: string = "visits";

export const fetchAllVisits = async () => {
    try {
        const result = await api.get(baseUrl)
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        console.error("An error occurred receiving visits: ", error);
        return [];
    }
}

export const fetchVisitById = async (id: string) => {
    try {
        const result = await api.get(`${baseUrl}/getVisitById/${id}`);
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        console.error("An error occurred receiving visit by id: ", error);
        return null;
    }
}

export const deleteVisitById = async (id: number) => {
    try {
        const result = await api.delete(`${baseUrl}/${id}`);
        console.log(result);
        return result;
    }
    catch (error) {
        console.error("An error occurred deleting visit: ", error);
    }
}

export const updateVisit = async (id: string, visit: Visit) => {
    try {
        return await api.put(`${baseUrl}/updateVisitByAdmin/${id}`, visit)
    }
    catch (err) {
        console.error(`Error occurred updating client: ${err}`);
    }
}

export const addVisit = async (visit: any) => {
    try {
        return await api.post(`${baseUrl}/createVisitByAdmin`, visit);
    }
    catch (error) {
        console.error("An error occurred adding visit: ", error);
    }
}

export const fetchAllAutorepairs = async () => {
    try {
        const result = await api.get('autorepair/all');
        return result.data;
    } catch (error) {
        console.error("Error fetching autorepairs:", error);
        return [];
    }
};

export const fetchCarsByClientId = async (clientId: number) => {
    try {
        const response = await api.get(`clients/getCarsByClientId/${clientId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cars:", error);
        return [];
    }
};

export const getVisitServices = async (visitId: number) => {
    try {
        const response = await api.get(`${baseUrl}/visitAutorepirs/${visitId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching visit services:", error);
        return [];
    }
}