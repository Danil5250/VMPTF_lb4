import api from "../../../main-api/api.ts";

export interface CategoryService {
    category_service_id?: number;
    category_name: string;
}

const baseUrl = "service-category-admin"

export const fetchAllCategories = async (): Promise<CategoryService[]> => {
    const response = await api.get(`${baseUrl}`);
    return response?.data;
};

export const fetchCategoryById = async (id: number): Promise<CategoryService> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response?.data();
};

export const createCategory = async (category: CategoryService): Promise<CategoryService> => {
    const response = await api.post(baseUrl, category);

    return response?.data;
};

export const updateCategory = async (id: number, category: CategoryService): Promise<CategoryService> => {
    const response = await api.put(`${baseUrl}/${id}`, category);
    return response?.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    return  await api.delete(`${baseUrl}/${id}`);
};
