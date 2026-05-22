export interface Service {
    id_service: number;
    name: string;
    description: string;
    base_price: number | null;
    guarantee_period: number;
    average_duration: number;
}