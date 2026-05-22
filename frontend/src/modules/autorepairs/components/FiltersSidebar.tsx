import React, {useEffect, useState} from 'react';
import {getAllSpecializations} from "../../specialization/api/specializationApi.ts";

interface FiltersSidebarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    cityFilter: string;
    onCityChange: (value: string) => void;
    specializationFilter: string;
    onSpecializationChange: (value: string) => void;
    workingDaysFilter: string[];
    onWorkingDayToggle: (day: string) => void;
    offset: number;
    limit: number;
    autorepairsCount: number;
    onOffsetChange: (offset: number) => void;
    onResetFilters: () => void;
}

interface Specialization {
    specialtion_id: number;
    name: string;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = React.memo(({
                                                                      searchQuery,
                                                                      onSearchChange,
                                                                      cityFilter,
                                                                      onCityChange,
                                                                      specializationFilter,
                                                                      onSpecializationChange,
                                                                      workingDaysFilter,
                                                                      onWorkingDayToggle,
                                                                      offset,
                                                                      limit,
                                                                      autorepairsCount,
                                                                      onOffsetChange,
                                                                      onResetFilters
                                                                  }) => {

    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSpecializations = async () => {
            setIsLoading(true);
            try {
                const data = await getAllSpecializations();
                if (data) {
                    setSpecializations(data);
                }
            } catch (error) {
                console.error("Failed to fetch specializations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecializations();
    }, []);

    return (
        <div className="lg:col-span-1 space-y-6">
            {/* Спеціалізація */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Спеціалізація</h3>
                {isLoading ? (
                    <div className="text-gray-500">Завантаження...</div>
                ) : (
                    <select
                        value={specializationFilter}
                        onChange={(e) => onSpecializationChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        disabled={isLoading}
                    >
                        <option value="">Всі спеціалізації</option>
                        {specializations.map((spec) => (
                            <option key={spec.specialtion_id} value={spec.name}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Місто */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Місто</h3>
                <input
                    type="text"
                    placeholder="Введіть місто..."
                    value={cityFilter}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* Дні роботи */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Дні роботи</h3>
                <div className="space-y-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
                        <label key={day} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={workingDaysFilter.includes(day)}
                                onChange={() => onWorkingDayToggle(day)}
                                className="rounded text-blue-500"
                            />
                            <span>{day}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Пагінація */}
            <div className="bg-white p-4 rounded-lg shadow mt-6">

                <div className="flex gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center w-full justify-center">
                        <button
                            disabled={offset === 0}
                            onClick={() => onOffsetChange(Math.max(offset - limit, 0))}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-40 hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            ← Назад
                        </button>

                        <span className="text-sm text-gray-600 mx-4 font-medium">
              Сторінка {Math.floor(offset / limit) + 1}
            </span>

                        <button
                            disabled={autorepairsCount < limit}
                            onClick={() => onOffsetChange(offset + limit)}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-40 hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            Вперед →
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Дії</h3>
                <button
                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                    onClick={onResetFilters}
                >
                    Скинути всі фільтри
                </button>
            </div>
        </div>
    );
});

export default FiltersSidebar;