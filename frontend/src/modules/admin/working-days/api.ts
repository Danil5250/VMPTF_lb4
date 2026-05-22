import api from "../../main-api/api.ts"; // Fixed import path - removed .ts extension as it is usually not needed in imports

const baseUrl = "working-days-admin";

export interface WorkingDay {
    schedule_id?: number;
    day_of_week: string;
    start_time_working: string;
    end_time_working: string;
    comment: string;
    autorepair_id: number;
    autorepair_name?: string;
}

export const fetchAllWorkingDays = async (): Promise<WorkingDay[]> => {
    try {
        const result = await api.get(baseUrl);
        return result.data;
    } catch (error) {
        console.error("Error fetching working days:", error);
        return [];
    }
};

export const fetchWorkingDayById = async (id: number): Promise<WorkingDay | null> => {
    try {
        const result = await api.get(`${baseUrl}/${id}`);
        return result.data;
    } catch (error) {
        console.error(`Error fetching working day with id ${id}:`, error);
        return null;
    }
};

export const createWorkingDay = async (data: WorkingDay): Promise<WorkingDay | null> => {
    try {
        const result = await api.post(baseUrl, data);
        return result.data;
    } catch (error) {
        console.error("Error creating working day:", error);
        return null;
    }
};

export const updateWorkingDay = async (id: number, data: WorkingDay): Promise<WorkingDay | null> => {
    try {
        const result = await api.patch(`${baseUrl}/${id}`, data);
        return result.data;
    } catch (error) {
        console.error(`Error updating working day with id ${id}:`, error);
        return null;
    }
};

export const deleteWorkingDay = async (id: number): Promise<void> => {
    try {
        await api.delete(`${baseUrl}/${id}`);
    } catch (error) {
        console.error(`Error deleting working day with id ${id}:`, error);
    }
};
