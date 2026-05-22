import { useState, useEffect, useCallback } from 'react';
import {getAutorepairStatistic, getFilteredAutorepairs} from "../api/autorepairPageService.ts";
import { useDebounce } from "../../utils/hooks/useDebounce.ts";
import Header from "../../components/header/Header.tsx";
import DebouncedInput from '../../utils/hooks/DebouncedInput.tsx';
import FiltersSidebar from '../components/FiltersSidebar.tsx';
import {useNavigate} from "react-router-dom";

interface Autorepair {
    autorepair_id: number;
    name: string;
    description?: string;
    adress?: string;
    index?: string;
    workers_amount: number;
    phone?: string;
    email?: string;
    ranking: number;
    specializations: string[];
    working_days: string[];
}


interface AutorepairStatistics {
    назва: string;
    опис?: string;
    кількість_спеціалізацій: string;
    кількість_послуг: string;
    адрес?: string;
    кількість_співробітників: number;
    номер_телефону?: string;
    email?: string;
    рейтинг: string;
    середня_ціна_послуг: string;
    кількість_робочих_днів: string;
    середня_тривалість_робочого_дня: string;
    візитів_за_тиждень: string;
    візитів_за_місяць: string;
    візитів_за_рік: string;
}

const AutorepairsPage: React.FC = () => {
    const [autorepairs, setAutorepairs] = useState<Autorepair[]>([]);
    const [loading, setLoading] = useState(false);

    const [statistics, setStatistics] = useState<AutorepairStatistics[]>([]);
    const [statsLoading, setStatsLoading] = useState(false);
    const [showStats, setShowStats] = useState(false);


    // Пошук / сортування
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'ranking' | 'workers_amount'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Фільтрація
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [workingDaysFilter, setWorkingDaysFilter] = useState<string[]>([]);

    // Пагінація
    const [limit] = useState(5);
    const [offset, setOffset] = useState(0);

    const navigate = useNavigate();

    const debouncedSearch = useDebounce(searchQuery, 400);
    const debouncedCity = useDebounce(cityFilter, 400);

    // Обработчики с useCallback
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleCityChange = useCallback((value: string) => {
        setCityFilter(value);
    }, []);

    const handleSpecializationChange = useCallback((value: string) => {
        setSpecializationFilter(value);
    }, []);

    const handleSortByChange = useCallback((value: 'name' | 'ranking' | 'workers_amount') => {
        setSortBy(value);
    }, []);

    const handleSortOrderChange = useCallback((value: 'asc' | 'desc') => {
        setSortOrder(value);
    }, []);

    const handleWorkingDayToggle = useCallback((day: string) => {
        setWorkingDaysFilter(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    }, []);

    const handleOffsetChange = useCallback((newOffset: number) => {
        setOffset(newOffset);
    }, []);

    const handleResetFilters = useCallback(() => {
        setSearchQuery('');
        setSpecializationFilter('');
        setCityFilter('');
        setWorkingDaysFilter([]);
        setSortBy('name');
        setSortOrder('asc');
        setOffset(0);
    }, []);

    // ---------- API CALL ----------
    const loadAutorepairs = useCallback(async () => {
        setLoading(true);
        try {
            console.log(specializationFilter)
            console.log(workingDaysFilter)
            const result = await getFilteredAutorepairs(
                debouncedSearch,
                debouncedCity,
                specializationFilter,
                workingDaysFilter,
                sortBy,
                sortOrder,
                limit,
                offset
            );
            setAutorepairs(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Error loading autorepairs:', error);
            setAutorepairs([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, debouncedCity, specializationFilter, workingDaysFilter, sortBy, sortOrder, limit, offset]);

    const loadStatistics = useCallback(async () => {
        setStatsLoading(true);

        try {
            const result = await getAutorepairStatistic()
            console.log(result)
            setTimeout(() => {
                setStatistics(result.data);
                setStatsLoading(false);
            }, 800)
        }
        catch (error) {
            console.error(error);
            setStatsLoading(false);
        }
    }, [])

    useEffect(() => {
        if (showStats && statistics.length === 0) {
            loadStatistics();
        }
    }, [showStats, statistics.length, loadStatistics]);


    useEffect(() => {
        setOffset(0);
    }, [debouncedSearch, debouncedCity, specializationFilter, workingDaysFilter, sortBy, sortOrder]);

    useEffect(() => {
        loadAutorepairs();
    }, [loadAutorepairs]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="text-2xl font-bold text-gray-800">Motointegrator</div>
                    <Header/>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Рекомендовані автосервіси та механіки</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Шукаєте автосервіс? AutoRepair пропонує 5886 рекомендованих СТО з технічного обслуговування.
                    Скористайтеся нашою пошуковою платформою автосервісів, дізнавайтеся ціни на послуги та знайдіть найкращих автослюсарів.
                </p>

                {/* Пошук */}
                <div className="mb-6">
                    <DebouncedInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Пошук за назвою або спеціалізацією..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                </div>

                {/* Сітка */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Фільтри */}
                    <FiltersSidebar
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        cityFilter={cityFilter}
                        onCityChange={handleCityChange}
                        specializationFilter={specializationFilter}
                        onSpecializationChange={handleSpecializationChange}
                        workingDaysFilter={workingDaysFilter}
                        onWorkingDayToggle={handleWorkingDayToggle}
                        offset={offset}
                        limit={limit}
                        autorepairsCount={autorepairs.length}
                        onOffsetChange={handleOffsetChange}
                        onResetFilters={handleResetFilters}
                    />

                    {/* Список */}
                    <div className="lg:col-span-3">
                        {/* Сортування */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                <span className="text-sm font-medium text-gray-700">Сортувати:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortByChange(e.target.value as any)}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="name">За назвою</option>
                                    <option value="ranking">За рейтингом</option>
                                    <option value="workers_amount">За кількістю співробітників</option>
                                </select>

                                <select
                                    value={sortOrder}
                                    onChange={(e) => handleSortOrderChange(e.target.value as any)}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="asc">За зростанням</option>
                                    <option value="desc">За спаданням</option>
                                </select>
                            </div>
                        </div>

                        {/* Результати */}
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Завантаження...</div>
                        ) : (
                            <div className="grid gap-4">
                                {autorepairs.map(ar => (
                                    <div key={ar.autorepair_id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold text-blue-600 mb-2">{ar.name}</h2>
                                                <p className="text-gray-600 text-sm mb-1">{ar.adress}</p>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-yellow-500 text-lg">★★★★★</span>
                                                    <span className="font-semibold text-gray-900">{ar.ranking}</span>
                                                    <span className="text-gray-500 text-sm">({ar.workers_amount} робітників)</span>
                                                </div>
                                            </div>
                                            <button
                                                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap ml-4"
                                                onClick={() => navigate(`/autorepair/${ar.autorepair_id}`)}
                                            >
                                                ЗАБРОНЮВАТИ ВІЗИТ
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {ar.specializations?.map((spec, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-3 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Дні роботи:</span> {ar.working_days?.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && autorepairs.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                                Не знайдено жодної автомайстерні за вказаними критеріями
                            </div>
                        )}

                        {/* Секція статистики */}
                        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">Статистика автомайстерень</h2>
                                        <p className="text-blue-100">Детальна інформація про роботу сервісів</p>
                                    </div>
                                    <button
                                        onClick={() => setShowStats(!showStats)}
                                        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        {showStats ? 'Приховати' : 'Показати статистику'}
                                    </button>
                                </div>
                            </div>

                            {showStats && (
                                <div className="p-6">
                                    {statsLoading ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <p className="mt-4">Завантаження статистики...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {statistics.map((stat, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                    {/* Заголовок */}
                                                    <div className="border-b border-gray-200 pb-4 mb-4">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{stat.назва}</h3>
                                                        <p className="text-gray-600 text-sm">{stat.опис}</p>
                                                        <p className="text-gray-500 text-sm mt-1">{stat.адрес}</p>
                                                    </div>

                                                    {/* Основна інформація */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                        <div className="bg-blue-50 p-4 rounded-lg">
                                                            <div className="text-sm text-blue-600 font-medium mb-1">Рейтинг</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-yellow-500 text-lg">★</span>
                                                                <span className="text-2xl font-bold text-gray-900">{stat.рейтинг}</span>
                                                            </div>
                                                        </div>

                                                        <div className="bg-green-50 p-4 rounded-lg">
                                                            <div className="text-sm text-green-600 font-medium mb-1">Співробітників</div>
                                                            <div className="text-2xl font-bold text-gray-900">{stat.кількість_співробітників}</div>
                                                        </div>

                                                        <div className="bg-purple-50 p-4 rounded-lg">
                                                            <div className="text-sm text-purple-600 font-medium mb-1">Середня ціна</div>
                                                            <div className="text-2xl font-bold text-gray-900">{parseFloat(stat.середня_ціна_послуг).toFixed(0)} ₴</div>
                                                        </div>
                                                    </div>

                                                    {/* Послуги та спеціалізації */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">Спеціалізацій</span>
                                                                <span className="text-lg font-semibold text-gray-900">{stat.кількість_спеціалізацій}</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">Послуг</span>
                                                                <span className="text-lg font-semibold text-gray-900">{stat.кількість_послуг}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Графік роботи */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">Робочих днів</span>
                                                                <span className="text-lg font-semibold text-gray-900">{stat.кількість_робочих_днів}</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">Годин на день</span>
                                                                <span className="text-lg font-semibold text-gray-900">{parseFloat(stat.середня_тривалість_робочого_дня).toFixed(1)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Статистика візитів */}
                                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                                                        <div className="text-sm font-medium text-gray-700 mb-3">Статистика візитів</div>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-orange-600">{stat.візитів_за_тиждень}</div>
                                                                <div className="text-xs text-gray-600 mt-1">За тиждень</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-orange-600">{stat.візитів_за_місяць}</div>
                                                                <div className="text-xs text-gray-600 mt-1">За місяць</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold text-orange-600">{stat.візитів_за_рік}</div>
                                                                <div className="text-xs text-gray-600 mt-1">За рік</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Контакти */}
                                                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
                                                        {stat.номер_телефону && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <span className="font-medium">📞</span>
                                                                <span>{stat.номер_телефону}</span>
                                                            </div>
                                                        )}
                                                        {stat.email && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <span className="font-medium">✉️</span>
                                                                <span>{stat.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );


    // return (
    //     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    //         <div className="max-w-full">
    //             <Header />
    //         </div>
    //
    //         <div className="container mx-auto px-4 py-25">
    //             <h1 className="text-3xl font-bold mb-8">Автомайстерні</h1>
    //
    //             {/* Пошук */}
    //             <div className="mb-6">
    //                 <DebouncedInput
    //                     value={searchQuery}
    //                     onChange={handleSearchChange}
    //                     placeholder="Пошук за назвою або спеціалізацією..."
    //                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                 />
    //             </div>
    //
    //             {/* Сітка */}
    //             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    //                 {/* Фільтри */}
    //                 <FiltersSidebar
    //                     searchQuery={searchQuery}
    //                     onSearchChange={handleSearchChange}
    //                     cityFilter={cityFilter}
    //                     onCityChange={handleCityChange}
    //                     specializationFilter={specializationFilter}
    //                     onSpecializationChange={handleSpecializationChange}
    //                     workingDaysFilter={workingDaysFilter}
    //                     onWorkingDayToggle={handleWorkingDayToggle}
    //                     offset={offset}
    //                     limit={limit}
    //                     autorepairsCount={autorepairs.length}
    //                     onOffsetChange={handleOffsetChange}
    //                     onResetFilters={handleResetFilters}
    //                 />
    //
    //                 {/* Список */}
    //                 <div className="lg:col-span-3">
    //                     {/* Сортування */}
    //                     <div className="bg-white p-4 rounded-lg shadow mb-6">
    //                         <div className="flex flex-wrap gap-4">
    //                             <select
    //                                 value={sortBy}
    //                                 onChange={(e) => handleSortByChange(e.target.value as any)}
    //                                 className="p-2 border border-gray-300 rounded"
    //                             >
    //                                 <option value="name">За назвою</option>
    //                                 <option value="ranking">За рейтингом</option>
    //                                 <option value="workers_amount">За кількістю співробітників</option>
    //                             </select>
    //
    //                             <select
    //                                 value={sortOrder}
    //                                 onChange={(e) => handleSortOrderChange(e.target.value as any)}
    //                                 className="p-2 border border-gray-300 rounded"
    //                             >
    //                                 <option value="asc">За зростанням</option>
    //                                 <option value="desc">За спаданням</option>
    //                             </select>
    //                         </div>
    //                     </div>
    //
    //                     {/* Результати */}
    //                     {loading ? (
    //                         <div className="text-center py-8 text-gray-500">Завантаження...</div>
    //                     ) : (
    //                         <div className="grid gap-4">
    //                             {autorepairs.map(ar => (
    //                                 <div key={ar.autorepair_id} className="bg-white p-6 rounded-lg shadow">
    //                                     <div className="flex justify-between items-start">
    //                                         <div>
    //                                             <h2 className="text-xl font-semibold">{ar.name}</h2>
    //                                             <p className="text-gray-600">{ar.specializations?.join(', ')}</p>
    //                                             <p className="text-gray-500">{ar.adress}</p>
    //                                         </div>
    //                                         <div className="text-right">
    //                                             <div className="flex items-center space-x-1">
    //                                                 <span className="text-yellow-500">★</span>
    //                                                 <span>{ar.ranking}</span>
    //                                             </div>
    //                                             <p className="text-gray-500">{ar.workers_amount} співроб.</p>
    //                                         </div>
    //                                     </div>
    //
    //                                     <div className="mt-4">
    //                                         <p className="text-sm text-gray-500">
    //                                             Дні роботи: {ar.working_days?.join(', ')}
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     )}
    //
    //                     {!loading && autorepairs.length === 0 && (
    //                         <div className="text-center py-8 text-gray-500">
    //                             Не знайдено жодної автомайстерні за вказаними критеріями
    //                         </div>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default AutorepairsPage;