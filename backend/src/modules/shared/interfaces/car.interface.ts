export interface Car {
    car_id: number;
    brand: string;
    model: string;
    engine_type: string | null;
    year: number | null;
    insurance: Date | string | null;
    license_plate: string;
    vin: string;
    client_id: number;
}