export interface Service {
    service_id: number;
    name: string;
}

export interface AutorepairService {
    autorepair_service_id: number;
    autorepair_id: number;
    service_id: number;
    service_name: string;
    service_price: number;
    garantie_term: number;
    duration: number;
}

export interface CreateAutorepairServiceData {
    autorepair_id: number;
    service_id: number;
    service_price: number;
    garantie_term?: number;
    duration: number;
}

export interface UpdateAutorepairServiceData {
    service_id?: number;
    service_price?: number;
    garantie_term?: number;
    duration?: number;
}
