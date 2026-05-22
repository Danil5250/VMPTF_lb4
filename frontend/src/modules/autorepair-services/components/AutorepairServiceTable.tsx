import React, { useState } from 'react';
import type { AutorepairService, Service, UpdateAutorepairServiceData } from '../interfaces/AutorepairService';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import Swal from "sweetalert2";

interface AutorepairServiceTableProps {
    services: Service[];
    autorepairServices: AutorepairService[];
    onUpdate: (id: number, data: UpdateAutorepairServiceData) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

const AutorepairServiceTable: React.FC<AutorepairServiceTableProps> = ({
    services,
    autorepairServices,
    onUpdate,
    onDelete
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<UpdateAutorepairServiceData>({});

    const handleEdit = (service: AutorepairService) => {
        setEditingId(service.autorepair_service_id);
        setEditData({
            service_id: service.service_id,
            service_price: service.service_price,
            garantie_term: service.garantie_term,
            duration: service.duration
        });
    };

    const handleSave = async (id: number) => {
        try {
            await onUpdate(id, editData);
            setEditingId(null);
            setEditData({});
        } catch (error) {
            const text = error.message || 'Помилка при оновленні послуги';
            await Swal.fire({
                title: 'Трапилась помилка',
                text,
                icon: 'error'
            })
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = async (id: number, serviceName: string) => {
        if (window.confirm(`Ви впевнені, що хочете видалити послугу "${serviceName}"?`)) {
            try {
                await onDelete(id);
            } catch (error) {
                console.log(error);
                const text = 'Не можна видалити послугу';
                await Swal.fire({
                    title: 'Трапилась помилка',
                    text,
                    icon: 'error'
                })
            }
        }
    };

    if (autorepairServices.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Послуги відсутні. Додайте першу послугу.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white border border-gray-200">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-800 text-white text-center">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Послуга</th>
                        <th className="px-4 py-3">Ціна (грн)</th>
                        <th className="px-4 py-3">Гарантія (днів)</th>
                        <th className="px-4 py-3">Тривалість (годин)</th>
                        <th className="px-4 py-3">Дії</th>
                    </tr>
                </thead>

                <tbody className="text-gray-700 text-center">
                    {autorepairServices.map((service) => {
                        const isEditing = editingId === service.autorepair_service_id;

                        return (
                            <tr key={service.autorepair_service_id} className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <td className="px-4 py-3">{service.autorepair_service_id}</td>

                                {/* Service Name */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <select
                                            value={editData.service_id}
                                            onChange={(e) => setEditData({ ...editData, service_id: parseInt(e.target.value) })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            {services.map((s) => (
                                                <option key={s.service_id} value={s.service_id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="font-medium">{service.service_name}</span>
                                    )}
                                </td>

                                {/* Service Price */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editData.service_price || ''}
                                            onChange={(e) => setEditData({ ...editData, service_price: parseFloat(e.target.value) })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0.01"
                                        />
                                    ) : (
                                        (+service.service_price).toFixed(2)
                                    )}
                                </td>

                                {/* Guarantee Term */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editData.garantie_term || ''}
                                            onChange={(e) => setEditData({ ...editData, garantie_term: parseInt(e.target.value) })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    ) : (
                                        service.garantie_term || 0
                                    )}
                                </td>

                                {/* Duration */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editData.duration || ''}
                                            onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                        />
                                    ) : (
                                        service.duration
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleSave(service.autorepair_service_id)}
                                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                title="Зберегти"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                                title="Скасувати"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                title="Редагувати"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.autorepair_service_id, service.service_name)}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                title="Видалити"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AutorepairServiceTable;
