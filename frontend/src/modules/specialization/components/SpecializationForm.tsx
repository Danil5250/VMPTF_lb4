import React, { useState } from 'react';
import type { Specialization, CreateAutorepairSpecializationData } from '../interfaces/AutorepairSpecialization';
import { Plus } from 'lucide-react';

interface SpecializationFormProps {
    autorepairId: number;
    specializations: Specialization[];
    onSubmit: (data: CreateAutorepairSpecializationData) => Promise<void>;
}

const SpecializationForm: React.FC<SpecializationFormProps> = ({
    autorepairId,
    specializations,
    onSubmit
}) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        specialtion_id: '',
        model: '',
        engine_type: '',
        year: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.specialtion_id) {
            alert('Будь ласка, оберіть бренд');
            return;
        }

        setIsSubmitting(true);
        try {
            const data: CreateAutorepairSpecializationData = {
                autorepair_id: autorepairId,
                specialtion_id: parseInt(formData.specialtion_id),
                model: formData.model || undefined,
                engine_type: formData.engine_type || undefined,
                year: formData.year ? parseInt(formData.year) : undefined
            };

            await onSubmit(data);

            // Reset form
            setFormData({
                specialtion_id: '',
                model: '',
                engine_type: '',
                year: ''
            });
            setIsFormVisible(false);
        } catch (error) {
            alert('Помилка при додаванні спеціалізації');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            specialtion_id: '',
            model: '',
            engine_type: '',
            year: ''
        });
        setIsFormVisible(false);
    };

    if (!isFormVisible) {
        return (
            <div className="mb-6">
                <button
                    onClick={() => setIsFormVisible(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Додати спеціалізацію
                </button>
            </div>
        );
    }

    return (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Додати нову спеціалізацію</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Brand Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Бренд <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.specialtion_id}
                            onChange={(e) => setFormData({ ...formData, specialtion_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Оберіть бренд</option>
                            {specializations.map((spec) => (
                                <option key={spec.specialtion_id} value={spec.specialtion_id}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Модель
                        </label>
                        <input
                            type="text"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Наприклад: X5"
                        />
                    </div>

                    {/* Engine Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тип двигуна
                        </label>
                        <input
                            type="text"
                            value={formData.engine_type}
                            onChange={(e) => setFormData({ ...formData, engine_type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Наприклад: Бензин, Дизель"
                        />
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Рік
                        </label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Наприклад: 2020"
                            min="1900"
                            max="2100"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Збереження...' : 'Зберегти'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SpecializationForm;
