import api from "../../main-api/api.ts";


interface ClientAuth {
    login: string;
    email: string;
    password: string;
}

interface ClientLogin {
    login: string;
    password: string;
}

const baseUrl = `clients`;

export const RegisterClient = async (client: ClientAuth) => {
    try {
        return await api.post(`${baseUrl}/register`, client);
    }
    catch (error) {
        throw error.response?.data || error;
        console.error("An error occurred adding client: ", error);
    }
}

export const LoginUser = async (client: ClientLogin) => {
    return await api.post(`${baseUrl}/login`, client);
}


export const LoginAutorepair = async (name: string, password: string) => {
    return await api.post(`autorepair/login`, {name, password});
}