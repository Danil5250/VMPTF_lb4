import React, { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import type {
    Specialization,
    AutorepairSpecialization,
    CreateAutorepairSpecializationData,
    UpdateAutorepairSpecializationData
} from '../interfaces/AutorepairSpecialization';
import {
    getAllSpecializations,
    getAutorepairSpecializations,
    createAutorepairSpecialization,
    updateAutorepairSpecialization,
    deleteAutorepairSpecialization
} from '../api/specializationApi';
import SpecializationForm from './SpecializationForm';
import SpecializationTable from './SpecializationTable';

interface SpecializationManagerProps {
    autorepairId: number;
}

const SpecializationManager: React.FC<SpecializationManagerProps> = ({ autorepairId }) => {
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [autorepairSpecializations, setAutorepairSpecializations] = useState<AutorepairSpecialization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load all specializations and autorepair-specific specializations
    useEffect(() => {
        loadData();
    }, [autorepairId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allSpecs, autorepairSpecs] = await Promise.all([
                getAllSpecializations(),
                getAutorepairSpecializations(autorepairId)
            ]);

            console.log(autorepairId);
            console.log(allSpecs);
            console.log(autorepairSpecs);

            setSpecializations(allSpecs);
            setAutorepairSpecializations(autorepairSpecs);
        } catch (error) {
            console.error('Error loading specializations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data: CreateAutorepairSpecializationData) => {
        const created = await createAutorepairSpecialization(data);
        setAutorepairSpecializations([...autorepairSpecializations, created]);
    };

    const handleUpdate = async (id: number, data: UpdateAutorepairSpecializationData) => {
        const updated = await updateAutorepairSpecialization(id, data);
        setAutorepairSpecializations(
            autorepairSpecializations.map(spec =>
                spec.specialtion_autorepair_id === id ? updated : spec
            )
        );
    };

    const handleDelete = async (id: number) => {
        await deleteAutorepairSpecialization(id);
        setAutorepairSpecializations(
            autorepairSpecializations.filter(spec => spec.specialtion_autorepair_id !== id)
        );
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <p className="text-center text-gray-500">Завантаження спеціалізацій...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-xl p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Управління спеціалізаціями</h2>
                </div>
                <p className="text-gray-600">
                    Додайте та керуйте спеціалізаціями вашої автомайстерні (бренди автомобілів, моделі, типи двигунів)
                </p>
            </div>

            {/* Add Form */}
            <SpecializationForm
                autorepairId={autorepairId}
                specializations={specializations}
                onSubmit={handleCreate}
            />

            {/* Table */}
            <SpecializationTable
                specializations={specializations}
                autorepairSpecializations={autorepairSpecializations}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />

            {/* Summary */}
            {autorepairSpecializations.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 font-medium">
                        Всього спеціалізацій: <span className="text-2xl font-bold">{autorepairSpecializations.length}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SpecializationManager;
