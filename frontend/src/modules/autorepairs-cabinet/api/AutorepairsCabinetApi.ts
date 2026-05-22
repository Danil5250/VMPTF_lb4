import api from "../../main-api/api.ts";


const baseUrl: string = "/autorepair"



export const topMostIncomedServicesForAutorepair = async(autorepairId:number, count: number) => {
    return await api.get(`${baseUrl}/mostIncomedServicesForAutorepair/${autorepairId}/${count}`)
}


export const getAllVisitsByAutorepairId = async(autorepairId:number) => {
    return await api.get(`${baseUrl}/visitbyAutorepair/${autorepairId}`);
}


