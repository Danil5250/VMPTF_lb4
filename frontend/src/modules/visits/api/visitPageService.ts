import api from "../../main-api/api.ts";
import type {Service} from "../../services/interfaces/Service.ts";
import type {OnlyVisit} from "../interfaces/OnlyVisit.ts";
import type {FullVisit, Visit} from "../interfaces/VisitUpdate.ts";

const baseUrl: string = "visits";


export interface VisitBody {
    car_brand?: string;
    car_model?: string;
    car_engineType?: string;
    car_year?: number;
    car_licensePlate?: string;
    car_vin?: string;

    client_name?: string;
    client_surname?: string;
    client_middlename?: string;
    client_email?: string;
    client_phone?: string;
    client_login?: string;
    client_password?: string;

    visit_selectedDate?: string | null;
    visit_selectedAlternativeDate?: string | null;
    visit_note?: string | null;
    visit_paymentWay?: string | null;
    visit_paymentStatus?: string | null;
    visit_isCompleted?: string | null;
    visit_carid?: string | null;
    visit_autorepairId?: string | null;

    visit_selectedServices?: string | number[];
}



export const addFullVisit = async (visit: FullVisit) => {
    try {
        const response = await api.post(`${baseUrl}/createFullVisit`, visit);
        return response.data;
    }
    catch (error) {
        throw error.response?.data || error;
        console.error("An error occurred adding visit: ", error);
    }
}


export const generateVisitRecord = async ({ visitId, clientId, carId }) => {

    const response = await api.post(
        `${baseUrl}/generateRecordVisit`,
        { visitId, clientId, carId },
        { responseType: "blob" }
    );

    return response.data;
};



export const updateVisit = async(visitId: number, visitBody: VisitBody) => {
    return await api.put(`${baseUrl}/updateFullVisit/${visitId}`, visitBody);
}


export const getVisitInfo = async (visitId: number) => {
    return await api.get(`${baseUrl}/getVisitAutorepairServicesById/${visitId}`);
}

export const setVisitIsCompleted = async (visitId: number, is_completed: boolean) => {
    return await api.put(`${baseUrl}/updateVisitIsComplete/${visitId}`, {is_completed});
}


export const updateAlternativeDateTime = async (
    visitId: number,
    date_time: string
) => {
    const isoDate = new Date(date_time).toISOString();

    return await api.put(
        `${baseUrl}/updateVisitDate/${visitId}`,
        { date_time: isoDate }
    );
};




export const fetchAllVisits = async () => {
    try {
        const result= await api.get(baseUrl)
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
    catch(error) {
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

// export const updateVisit = async (id:string, visit: Visit) => {
//     try {
//         return await api.put(`${baseUrl}/${id}`, visit)
//     }
//     catch(err) {
//         console.error(`Error occurred updating client: ${err}`);
//     }
// }

export const addVisit = async (visit: Visit) => {
    try {
        return await api.post(baseUrl, visit);
    }
    catch (error) {
        console.error("An error occurred adding visit: ", error);
    }
}

export const sendQuery = async (query: string) => {
    try {
        return await api.post(`${baseUrl}/query`, {query})
    }
    catch (error) {
        console.error("An error occurred sending query: ", error);
    }
}