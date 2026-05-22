export interface OnlyVisit {
    id_visit: number;
    date_time: string;
    alternative_date_time: string | null;
    note: string | null;
    payment_method: string;
    payment_status: boolean;
    client_id: number;
    services_id: number[];
}
