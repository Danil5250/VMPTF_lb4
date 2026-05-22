import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import type {
    Service,
    AutorepairService,
    CreateAutorepairServiceData,
    UpdateAutorepairServiceData
} from '../interfaces/AutorepairService';
import {
    getAllServices,
    getAutorepairServices,
    createAutorepairService,
    updateAutorepairService,
    deleteAutorepairService
} from '../api/autorepairServicesApi';
import AutorepairServiceForm from './AutorepairServiceForm';
import AutorepairServiceTable from './AutorepairServiceTable';

interface AutorepairServiceManagerProps {
    autorepairId: number;
}

const AutorepairServiceManager: React.FC<AutorepairServiceManagerProps> = ({ autorepairId }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [autorepairServices, setAutorepairServices] = useState<AutorepairService[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [autorepairId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allServices, autorepairServs] = await Promise.all([
                getAllServices(),
                getAutorepairServices(autorepairId)
            ]);

            console.log(autorepairId);
            console.log(allServices);
            console.log(autorepairServs);

            setServices(allServices);
            setAutorepairServices(autorepairServs);
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data: CreateAutorepairServiceData) => {
        const created = await createAutorepairService(data);
        setAutorepairServices([...autorepairServices, created]);
    };

    const handleUpdate = async (id: number, data: UpdateAutorepairServiceData) => {
        const updated = await updateAutorepairService(id, data);
        setAutorepairServices(
            autorepairServices.map(service =>
                service.autorepair_service_id === id ? updated : service
            )
        );
    };

    const handleDelete = async (id: number) => {
        await deleteAutorepairService(id);
        setAutorepairServices(
            autorepairServices.filter(service => service.autorepair_service_id !== id)
        );
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <p className="text-center text-gray-500">Завантаження послуг...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-xl p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Управління послугами</h2>
                </div>
                <p className="text-gray-600">
                    Додайте та керуйте послугами вашої автомайстерні з відповідними цінами та умовами
                </p>
            </div>

            {/* Add Form */}
            <AutorepairServiceForm
                autorepairId={autorepairId}
                services={services}
                onSubmit={handleCreate}
            />

            {/* Table */}
            <AutorepairServiceTable
                services={services}
                autorepairServices={autorepairServices}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />

            {/* Summary */}
            {autorepairServices.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 font-medium">
                        Всього послуг: <span className="text-2xl font-bold">{autorepairServices.length}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default AutorepairServiceManager;
