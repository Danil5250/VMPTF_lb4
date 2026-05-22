export interface Client {
    id_client: number;
    name: string;
    surname: string;
    middlename: string | null;
    email: string;
    phone: string | null;
    login: string | null;
}