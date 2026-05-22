import React, { useState } from 'react';
import type { AutorepairSpecialization, Specialization, UpdateAutorepairSpecializationData } from '../interfaces/AutorepairSpecialization';
import { Pencil, Trash2, Save, X } from 'lucide-react';

interface SpecializationTableProps {
    specializations: Specialization[];
    autorepairSpecializations: AutorepairSpecialization[];
    onUpdate: (id: number, data: UpdateAutorepairSpecializationData) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

const SpecializationTable: React.FC<SpecializationTableProps> = ({
    specializations,
    autorepairSpecializations,
    onUpdate,
    onDelete
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<UpdateAutorepairSpecializationData>({});

    const handleEdit = (spec: AutorepairSpecialization) => {
        setEditingId(spec.specialtion_autorepair_id);
        setEditData({
            specialtion_id: spec.specialtion_id,
            model: spec.model || '',
            engine_type: spec.engine_type || '',
            year: spec.year || undefined
        });
    };

    const handleSave = async (id: number) => {
        try {
            await onUpdate(id, editData);
            setEditingId(null);
            setEditData({});
        } catch (error) {
            alert('Помилка при оновленні спеціалізації');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = async (id: number, brandName: string) => {
        if (window.confirm(`Ви впевнені, що хочете видалити спеціалізацію "${brandName}"?`)) {
            try {
                await onDelete(id);
            } catch (error) {
                alert('Помилка при видаленні спеціалізації');
            }
        }
    };

    if (autorepairSpecializations.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Спеціалізації відсутні. Додайте першу спеціалізацію.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white border border-gray-200">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-800 text-white text-center">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Бренд</th>
                        <th className="px-4 py-3">Модель</th>
                        <th className="px-4 py-3">Тип двигуна</th>
                        <th className="px-4 py-3">Рік</th>
                        <th className="px-4 py-3">Дії</th>
                    </tr>
                </thead>

                <tbody className="text-gray-700 text-center">
                    {autorepairSpecializations.map((spec) => {
                        const isEditing = editingId === spec.specialtion_autorepair_id;

                        return (
                            <tr key={spec.specialtion_autorepair_id} className="hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <td className="px-4 py-3">{spec.specialtion_autorepair_id}</td>

                                {/* Brand */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <select
                                            value={editData.specialtion_id}
                                            onChange={(e) => setEditData({ ...editData, specialtion_id: parseInt(e.target.value) })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            {specializations.map((s) => (
                                                <option key={s.specialtion_id} value={s.specialtion_id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="font-medium">{spec.specialization_name}</span>
                                    )}
                                </td>

                                {/* Model */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.model || ''}
                                            onChange={(e) => setEditData({ ...editData, model: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        spec.model || '—'
                                    )}
                                </td>

                                {/* Engine Type */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.engine_type || ''}
                                            onChange={(e) => setEditData({ ...editData, engine_type: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        spec.engine_type || '—'
                                    )}
                                </td>

                                {/* Year */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editData.year || ''}
                                            onChange={(e) => setEditData({ ...editData, year: e.target.value ? parseInt(e.target.value) : undefined })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min="1900"
                                            max="2100"
                                        />
                                    ) : (
                                        spec.year || '—'
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    {isEditing ? (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleSave(spec.specialtion_autorepair_id)}
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
                                                onClick={() => handleEdit(spec)}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                title="Редагувати"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(spec.specialtion_autorepair_id, spec.specialization_name)}
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

export default SpecializationTable;
