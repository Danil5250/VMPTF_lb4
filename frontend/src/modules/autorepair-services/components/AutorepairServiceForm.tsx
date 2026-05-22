import React, { useState } from 'react';
import type { Service, CreateAutorepairServiceData } from '../interfaces/AutorepairService';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

interface AutorepairServiceFormProps {
    autorepairId: number;
    services: Service[];
    onSubmit: (data: CreateAutorepairServiceData) => Promise<void>;
}

const AutorepairServiceForm: React.FC<AutorepairServiceFormProps> = ({
    autorepairId,
    services,
    onSubmit
}) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        service_id: '',
        service_price: '',
        garantie_term: '',
        duration: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.service_id) {
            await Swal.fire({
                text: 'Будь ласка, оберіть послугу'
            });
            return;
        }

        if (!formData.service_price || parseFloat(formData.service_price) <= 0) {
            await Swal.fire({
                text: 'Будь ласка, введіть коректну ціну'
            });
            return;
        }

        if (!formData.duration || parseInt(formData.duration) <= 0) {
            await Swal.fire({
                text: 'Будь ласка, введіть коректну тривалість'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const data: CreateAutorepairServiceData = {
                autorepair_id: autorepairId,
                service_id: parseInt(formData.service_id),
                service_price: parseFloat(formData.service_price),
                garantie_term: formData.garantie_term ? parseInt(formData.garantie_term) : undefined,
                duration: parseInt(formData.duration)
            };

            await onSubmit(data);

            // Reset form
            setFormData({
                service_id: '',
                service_price: '',
                garantie_term: '',
                duration: ''
            });
            setIsFormVisible(false);
        } catch (error) {
            await Swal.fire({
                title: "Помилка при додаванні послуги",
                icon: "error",
            })
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            service_id: '',
            service_price: '',
            garantie_term: '',
            duration: ''
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
                    Додати послугу
                </button>
            </div>
        );
    }

    return (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Додати нову послугу</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Послуга <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.service_id}
                            onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Оберіть послугу</option>
                            {services.map((service) => (
                                <option key={service.service_id} value={service.service_id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ціна <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.service_price}
                            onChange={(e) => setFormData({ ...formData, service_price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Наприклад: 500"
                            min="0.01"
                            required
                        />
                    </div>

                    {/* Guarantee Term */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Гарантійний термін (днів)
                        </label>
                        <input
                            type="number"
                            value={formData.garantie_term}
                            onChange={(e) => setFormData({ ...formData, garantie_term: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Наприклад: 30"
                            min="0"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тривалість (годин) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Наприклад: 2"
                            min="1"
                            required
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

export default AutorepairServiceForm;
