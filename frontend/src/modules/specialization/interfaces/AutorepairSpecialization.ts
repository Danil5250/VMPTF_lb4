export interface Specialization {
    specialtion_id: number;
    name: string;
}

export interface AutorepairSpecialization {
    specialtion_autorepair_id: number;
    autorepair_id: number;
    specialtion_id: number;
    specialization_name: string;
    model?: string;
    engine_type?: string;
    year?: number;
}

export interface CreateAutorepairSpecializationData {
    autorepair_id: number;
    specialtion_id: number;
    model?: string;
    engine_type?: string;
    year?: number;
}

export interface UpdateAutorepairSpecializationData {
    specialtion_id?: number;
    model?: string;
    engine_type?: string;
    year?: number;
}
