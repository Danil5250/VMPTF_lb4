import React, { useEffect, useState } from 'react';
import { fetchAllCategories, createCategory, updateCategory, deleteCategory, type CategoryService } from './api/serviceCategoryApi';
import { Trash2, Plus, X, Edit, Layers } from 'lucide-react';
import Swal from 'sweetalert2';

const ServiceCategoryManager = () => {
    const [categories, setCategories] = useState<CategoryService[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryService | null>(null);

    // Form State
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await fetchAllCategories();
            setCategories(result || []);
        } catch (error) {
            console.error("Error loading data:", error);
            Swal.fire('Error', 'Failed to load categories', 'error');
        }
    };

    const handleEdit = (category: CategoryService) => {
        setEditingCategory(category);
        setCategoryName(category.category_name);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteCategory(id);
                Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                loadData();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete category', 'error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: CategoryService = {
            category_name: categoryName
        };

        try {
            if (editingCategory && editingCategory.category_service_id) {
                await updateCategory(editingCategory.category_service_id, payload);
                Swal.fire('Success', 'Category updated successfully!', 'success');
            } else {
                await createCategory(payload);
                Swal.fire('Success', 'Category created successfully!', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', 'Operation failed', 'error');
        }
    };

    const resetForm = () => {
        setEditingCategory(null);
        setCategoryName('');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers className="text-blue-600" /> Service Category Management
                </h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">Category Name</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <tr key={category.category_service_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-500">#{category.category_service_id}</td>
                                    <td className="p-4 font-medium">{category.category_name}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.category_service_id!)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g. Engine Repair"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceCategoryManager;
