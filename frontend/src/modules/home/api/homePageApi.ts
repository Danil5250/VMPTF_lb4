import api from "../../main-api/api.ts";


export const getTopActiveUsers = async(count: number) => {
    return await api.get(`clients/topActiveClients/${count}`)
}