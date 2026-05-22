import {PaymentStatus, PaymentWay} from "../types/types";

export interface Visit {
    visit_id: number;
    date_time: Date | string | null;
    alternative_date_time: Date | string | null;
    note: string | null;
    payment_way: PaymentWay | null;
    payment_status: PaymentStatus | null;
    is_completed: boolean;
    is_urgent: boolean;
    car_id: number;
    autorepair_id: number | null;
}