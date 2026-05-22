import React, { useEffect, useState } from 'react';
import { getAllServices, addService, updateService, deleteService, getCategoryServices } from '../api/servicePageService';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {getAllCars} from "../../cars/api/apiCars.ts";

interface Service {
    service_id?: number;
    name: string;
    description: string;
    category_services_id?: number;
}

const ServiceManager = () => {
    const [services, setServices] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);


    const [formData, setFormData] = useState<Service>({
        name: '',
        description: '',
        category_services_id: undefined
    });
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [servicesData, categoriesData] = await Promise.all([
                getAllServices(),
                getCategoryServices(),
            ]);

            console.log(categoriesData)

            setServices(servicesData || []);
            setCategories(categoriesData?.data || []);
        }
        catch (error) {
            Swal.fire({
                title: 'Трапилась помилка завнтаження даних'
            })
        }

    };



    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            await deleteService(id);
            Swal.fire('Deleted!', 'Service has been deleted.', 'success');
            fetchData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            category_services_id: selectedCategory?.value
        };

        if (editingService && editingService.service_id) {
            // @ts-ignore
            await updateService(editingService.service_id.toString(), payload);
            Swal.fire('Updated!', 'Service has been updated.', 'success');
        } else {
            // @ts-ignore
            await addService(payload);
            Swal.fire('Added!', 'Service has been added.', 'success');
        }
        setIsModalOpen(false);
        fetchData();
        resetForm();
    };

    const openEditModal = (service: any) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description || '',
            category_services_id: service.category_services_id
        });

        console.log(service)
        console.log(categories)

        const foundCat = categories.find(c => c.category_service_id == service.category_services_id);
        console.log(foundCat)
        if (foundCat) {
            setSelectedCategory({ value: foundCat.category_service_id, label: foundCat.category_name });
        } else {
            setSelectedCategory(null);
        }

        setIsModalOpen(true);
    };



    const resetForm = () => {
        setEditingService(null);
        setFormData({
            name: '',
            description: '',
            category_services_id: undefined
        });
        setSelectedCategory(null);
    };

    const categoryOptions = categories.map((c: any) => ({
        value: c.category_service_id,
        label: c.category_name
    }));

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((service) => (
                                <tr key={service.service_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">{service.name}</td>
                                    <td className="p-4">{service.description}</td>
                                    <td className="p-4">
                                        {categories.find(c => c.category_service_id === service.category_services_id)?.category_name || service.category_services_id}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.service_id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-visible">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <Select
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    placeholder="Select category..."
                                    isClearable
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
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
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManager;
