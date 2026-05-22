
import React, { useEffect, useState } from 'react';
import {
    fetchAllSpecializationAutorepairs,
    fetchAutorepairOptions,
    fetchSpecializationOptions,
    createSpecializationAutorepair,
    updateSpecializationAutorepair,
    deleteSpecializationAutorepair,
    type SpecializationAutorepair,
    type AutorepairOption,
    type SpecializationOption
} from './api/specializationAutorepairsApi';
import { Trash2, Plus, X, Edit, Wrench } from 'lucide-react';
import Swal from 'sweetalert2';

const SpecializationAutorepairManager = () => {
    const [data, setData] = useState<SpecializationAutorepair[]>([]);
    const [autorepairs, setAutorepairs] = useState<AutorepairOption[]>([]);
    const [specializations, setSpecializations] = useState<SpecializationOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SpecializationAutorepair | null>(null);

    // Form State
    const [model, setModel] = useState('');
    const [engineType, setEngineType] = useState('');
    const [year, setYear] = useState('');
    const [autorepairId, setAutorepairId] = useState('');
    const [specializationId, setSpecializationId] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [items, arOptions, specOptions] = await Promise.all([
                fetchAllSpecializationAutorepairs(),
                fetchAutorepairOptions(),
                fetchSpecializationOptions()
            ]);
            setData(items || []);
            setAutorepairs(arOptions || []);
            setSpecializations(specOptions || []);
        } catch (error) {
            console.error("Error loading data:", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        }
    };

    const handleEdit = (item: SpecializationAutorepair) => {
        setEditingItem(item);
        setModel(item.model || '');
        setEngineType(item.engine_type || '');
        setYear(item.year?.toString() || '');
        setAutorepairId(item.autorepair_id.toString());
        setSpecializationId(item.specialtion_id.toString());
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
                await deleteSpecializationAutorepair(id);
                Swal.fire('Deleted!', 'Item has been deleted.', 'success');
                loadData();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete item', 'error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!autorepairId || !specializationId) {
            Swal.fire('Error', 'Please select Autorepair and Specialization', 'error');
            return;
        }

        const payload: SpecializationAutorepair = {
            model: model || undefined,
            engine_type: engineType || undefined,
            year: year ? parseInt(year) : undefined,
            autorepair_id: parseInt(autorepairId),
            specialtion_id: parseInt(specializationId)
        };

        try {
            if (editingItem && editingItem.specialtion_autorepair_id) {
                await updateSpecializationAutorepair(editingItem.specialtion_autorepair_id, payload);
                Swal.fire('Success', 'Updated successfully!', 'success');
            } else {
                await createSpecializationAutorepair(payload);
                Swal.fire('Success', 'Created successfully!', 'success');
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
        setEditingItem(null);
        setModel('');
        setEngineType('');
        setYear('');
        setAutorepairId('');
        setSpecializationId('');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Wrench className="text-blue-600" /> Specialization Autorepairs Management
                </h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Assignment
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">Model</th>
                                <th className="p-4 font-medium">Engine Type</th>
                                <th className="p-4 font-medium">Year</th>
                                <th className="p-4 font-medium">Autorepair</th>
                                <th className="p-4 font-medium">Specialization</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item) => (
                                <tr key={item.specialtion_autorepair_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-500">#{item.specialtion_autorepair_id}</td>
                                    <td className="p-4">{item.model || '-'}</td>
                                    <td className="p-4">{item.engine_type || '-'}</td>
                                    <td className="p-4">{item.year || '-'}</td>
                                    <td className="p-4 font-medium text-blue-600">{item.autorepair_name}</td>
                                    <td className="p-4 font-medium text-green-600">{item.specialization_name}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.specialtion_autorepair_id!)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No assignments found
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
                                {editingItem ? 'Edit Assignment' : 'Add New Assignment'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Autorepair</label>
                                <select
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={autorepairId}
                                    onChange={(e) => setAutorepairId(e.target.value)}
                                >
                                    <option value="">Select Autorepair</option>
                                    {autorepairs.map(ar => (
                                        <option key={ar.autorepair_id} value={ar.autorepair_id}>{ar.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <select
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={specializationId}
                                    onChange={(e) => setSpecializationId(e.target.value)}
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map(spec => (
                                        <option key={spec.specialtion_id} value={spec.specialtion_id}>{spec.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="e.g. Toyota Camry"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={engineType}
                                    onChange={(e) => setEngineType(e.target.value)}
                                    placeholder="e.g. 2.5L Hybrid"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year (Optional)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    placeholder="e.g. 2022"
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
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecializationAutorepairManager;
