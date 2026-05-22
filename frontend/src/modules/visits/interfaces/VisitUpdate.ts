export interface Visit {
    date_time: string;
    alternative_date_time: string | null;
    note: string | null;
    payment_method: string;
    payment_status: boolean;
    client_id: number;
    services_id: number[];
}

export interface FullVisit {
    // Car data
    car_brand: string;
    car_model: string;
    car_engineType?: string;
    car_year?: number;
    car_licensePlate: string;
    car_vin?: string;

    // Client data
    client_name: string;
    client_surname?: string;
    client_middlename?: string;
    client_email: string;
    client_phone?: string;
    client_login?: string;
    client_password?: string;

    // Visit data
    visit_selectedDate?: string | null;
    visit_selectedAlternativeDate?: string | null;
    visit_note?: string | null;
    visit_paymentWay?: string | null;
    visit_paymentStatus?: string | null;
    visit_isCompleted?: string | null;
    visit_carid?: string | null;
    visit_autorepairId?: string | null;

    is_urgent: boolean | null;
    // Services
    visit_selectedServices: number[] | string;
}


interface CarData {
    brand?: string;
    engineType?: string;
    licensePlate?: string;
    model?: string;
    vin?: string;
    year?: string;
}

interface PersonalData {
    email?: string;
    name?: string;
    phone?: string;
}