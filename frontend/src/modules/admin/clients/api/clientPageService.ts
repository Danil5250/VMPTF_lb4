    import api from "../../../main-api/api.ts";
    import type { ClientFormData } from "../interfaces/ClientFormData.tsx";
    import type { Client } from "../interfaces/Client.ts";

    const baseUrl: string = "clients";

    export const getAllClients = async () => {
        try {
            const result = await api.get(`${baseUrl}/all`);
            console.log(result.data)
            return result.data;
        }
        catch (err) {
            console.error(`Error occurred receiving the clients: ${err}`);
            return [];
        }
    }

    export const addClient = async (client: ClientFormData) => {
        try {
            return await api.post(baseUrl, client);
        }
        catch (err) {
            console.error(`Error occurred adding a client: ${err}`);
            return [];
        }
    }

    export const getClientInfo = async (id: string) => {
        try {
            const result = await api.get(`${baseUrl}/info/${id}`);
            console.log(result.data);
            return result.data;
        }
        catch (err) {
            console.error(`Error occurred getting a client: ${err}`);
            return [];
        }
    }


    export const deleteClientById = async (id: number) => {
        try {
            const result = await api.delete(`${baseUrl}/${id}`);
            console.log(result);
            return result;
        }
        catch (err) {
            console.error(`Error occurred deleting a client: ${err}`);
            return;
        }
    }

    export const getClient = async (id: string) => {
        try {
            const result = await api.get(`${baseUrl}/getClientById/${id}`);
            console.log(result.data);
            return result.data;
        }
        catch (err) {
            console.error(`Error occurred getting client: ${err}`);
        }
    }

    export const updateClient = async (id: string, client: Client) => {
        try {
            return await api.put(`${baseUrl}/${id}`, client)
        }
        catch (err) {
            console.error(`Error occurred updating client: ${err}`);
        }
    }