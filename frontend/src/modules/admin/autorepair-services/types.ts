export interface AutorepairService {
    autorepair_service_id: number;
    autorepair_id: number;
    autorepair_name: string;
    service_id: number;
    service_name: string;
    service_price: number | string;
    garantie_term: number;
    duration: number;
}

export interface AutorepairForSelect {
    autorepair_id: number;
    name: string;
}

export interface ServiceForSelect {
    service_id: number;
    name: string;
}
