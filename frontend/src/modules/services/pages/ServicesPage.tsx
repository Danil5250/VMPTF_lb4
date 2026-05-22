import { useState, useEffect } from 'react';
import Header from "../../components/header/Header.tsx";
import {useDebounce} from "../../utils/hooks/useDebounce.ts";
import DebouncedInput from "../../utils/hooks/DebouncedInput.tsx";
import {getAllCategoryServices} from "../../serviceCategory/api/serviceCategoryApi.ts";
import {getFilteredServices, getServicesFiltersMax} from "../api/servicePageService.ts";
import { Clock, Shield, DollarSign, Phone, Mail, MapPin, Tag, Wrench } from "lucide-react";
import {useNavigate} from "react-router-dom";
import ServicesStatistics from "../components/ServicesStatistics.tsx";




interface Service {
    autorepair_service_id: number;
    name: string;
    description: string;
    service_price: number;
    duration: number;
    garantie_term: number;
    category_name: string;
    autorepair_name: string;
    autorepair_phone: string;
    autorepair_email: string;
    autorepair_id: string;
}

interface ServiceCategory {
    category_service_id: number;
    category_name: string;
}

const ServicesPage: React.FC = () => {
    // Стан для зберігання даних
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Стани для пошуку
    const [searchQuery, setSearchQuery] = useState('');

    // Стани для сортування
    const [sortBy, setSortBy] = useState<'name' | 'basePrice' | 'duration' | 'warranty'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Стани для фільтрації
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [warrantyRange, setWarrantyRange] = useState<[number, number]>([0, 36]);
    const [durationRange, setDurationRange] = useState<[number, number]>([0, 24]);
    const [categoryFilter, setCategoryFilter] = useState('');

    const [categories, setCategories] = useState<ServiceCategory[]>([]);

    // Debounced значення
    const debouncedSearchQuery = useDebounce(searchQuery, 400);
    const debouncedPriceRange = useDebounce(priceRange, 300);
    const debouncedWarrantyRange = useDebounce(warrantyRange, 300);
    const debouncedDurationRange = useDebounce(durationRange, 300);
    const debouncedCategoryFilter = useDebounce(categoryFilter, 300);

    const navigate = useNavigate();

    // Пагінація
    const [limit] = useState(5);
    const [offset, setOffset] = useState(0);




    // Завантаження категорій
    useEffect(() => {
        const fetchCategoriesServices = async() => {
            try {
                setCategories(await getAllCategoryServices());
            }
            catch (err) {
                console.log(err);
            }
        }



        fetchCategoriesServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                search: debouncedSearchQuery,
                category: debouncedCategoryFilter,
                minPrice: debouncedPriceRange[0].toString(),
                maxPrice: debouncedPriceRange[1].toString(),
                minWarranty: debouncedWarrantyRange[0].toString(),
                maxWarranty: debouncedWarrantyRange[1].toString(),
                minDuration: debouncedDurationRange[0].toString(),
                maxDuration: debouncedDurationRange[1].toString(),
                sortBy,
                sortOrder: sortOrder.toUpperCase() as 'ASC' | 'DESC',
                limit: limit.toString(),
                offset: offset.toString()
            };

            const result = await getFilteredServices(params);
            setServices(result);
        } catch (err) {
            console.error('Error loading services:', err);
            setError('Не вдалося завантажити послуги');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, [
        debouncedSearchQuery,
        debouncedCategoryFilter,
        debouncedPriceRange,
        debouncedWarrantyRange,
        debouncedDurationRange,
        sortBy,
        sortOrder,
        limit,
        offset
    ]);

    // Скидання offset при зміні фільтрів (окрім пагінації)
    useEffect(() => {
        setOffset(0);
    }, [debouncedSearchQuery, debouncedCategoryFilter, debouncedPriceRange, debouncedWarrantyRange, debouncedDurationRange, sortBy, sortOrder]);

    // Обробники змін
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as 'name' | 'basePrice' | 'duration' | 'warranty');
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value as 'asc' | 'desc');
    };

    const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryFilter(e.target.value);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 1000000]);
        setWarrantyRange([0, 36]);
        setDurationRange([0, 24]);
        setCategoryFilter('');
        setSortBy('name');
        setSortOrder('asc');
        setOffset(0);
    };

    // Обробники пагінації
    const handleNextPage = () => {
        setOffset(prev => prev + limit);
    };

    const handlePrevPage = () => {
        setOffset(prev => Math.max(0, prev - limit));
    };

    const handleOffsetChange = (newOffset: number) => {
        setOffset(newOffset);
    };

    const currentPage = Math.floor(offset / limit) + 1;

    return (
        <>
            <div className="max-w-full">
                <Header/>
            </div>

            <div className="container mx-auto px-4 py-25">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Послуги автомайстерень</h1>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Скинути фільтри
                    </button>
                </div>

                <div className="mb-6">
                    <DebouncedInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Пошук послуг за назвою або описом..."
                        delay={400}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Бічна панель фільтрів */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Сортування */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">Сортування</h3>
                            <div className="space-y-3">
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="name">За назвою</option>
                                    <option value="basePrice">За базовою ціною</option>
                                    <option value="duration">За часом виконання</option>
                                    <option value="warranty">За гарантійним терміном</option>
                                </select>

                                <select
                                    value={sortOrder}
                                    onChange={handleOrderChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="asc">За зростанням</option>
                                    <option value="desc">За спаданням</option>
                                </select>
                            </div>
                        </div>

                        {/* Фільтр за категорією */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">Категорія</h3>
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryFilter}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Всі категорії</option>
                                {categories.map(category => (
                                    <option key={category.category_service_id} value={category.category_name}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Фільтр за ціною */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">Ціна, грн</h3>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                        placeholder="Від"
                                    />
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                        placeholder="До"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000000"
                                    step="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Фільтр за гарантією */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">Гарантія, міс.</h3>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={warrantyRange[0]}
                                        onChange={(e) => setWarrantyRange([Number(e.target.value), warrantyRange[1]])}
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                        placeholder="Від"
                                    />
                                    <input
                                        type="number"
                                        value={warrantyRange[1]}
                                        onChange={(e) => setWarrantyRange([warrantyRange[0], Number(e.target.value)])}
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                        placeholder="До"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    step="1"
                                    value={warrantyRange[1]}
                                    onChange={(e) => setWarrantyRange([warrantyRange[0], Number(e.target.value)])}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Фільтр за тривалістю */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">Тривалість, год</h3>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={durationRange[0]}
                                        onChange={(e) => setDurationRange([Number(e.target.value), durationRange[1]])}
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                        placeholder="Від"
                                    />
                                    <input
                                        type="number"
                                        value={durationRange[1]}
                                        onChange={(e) => setDurationRange([durationRange[0], Number(e.target.value)])}
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                        placeholder="До"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={durationRange[1]}
                                    onChange={(e) => setDurationRange([durationRange[0], Number(e.target.value)])}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Пагінація в бічній панелі */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">Сторінки</h3>
                            <div className="flex gap-3 items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-40 hover:bg-blue-600 transition-colors"
                                        disabled={offset === 0 || loading}
                                        onClick={() => handleOffsetChange(Math.max(offset - limit, 0))}
                                    >
                                        ← Назад
                                    </button>

                                    <span className="text-sm text-gray-600 mx-2">
                                        Сторінка {currentPage}
                                    </span>

                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-40 hover:bg-blue-600 transition-colors"
                                        disabled={services.length < limit || loading}
                                        onClick={() => handleOffsetChange(offset + limit)}
                                    >
                                        Вперед →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Основний контент */}
                    <div className="lg:col-span-3">
                        <div className="lg:col-span-3">
                            {/* Завантаження */}
                            {loading && (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-blue-400 text-6xl mb-4">⏳</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Завантаження послуг...</h3>
                                    <p className="text-gray-500">Зачекайте, будь ласка</p>
                                </div>
                            )}

                        {/* Помилка */}
                            {error && (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                                    <h3 className="text-xl font-semibold text-red-600 mb-2">{error}</h3>
                                    <button
                                        onClick={loadServices}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium mt-4"
                                    >
                                        Спробувати ще раз
                                    </button>
                                </div>
                            )}

                        {/* Список послуг */}
                            {!loading && !error && (
                                <div className="grid gap-4">
                                    {services.map(service => (
                                        <div
                                            key={service.autorepair_service_id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                                        >
                                            {/* Header з назвою послуги та ціною */}
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                            {service.name}
                                                        </h2>
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                                            <Tag className="w-4 h-4" />
                                                            {service.category_name}
                                        </span>
                                                    </div>
                                                    <div className="text-right ml-6">
                                                        <div className="text-3xl font-bold text-green-600">
                                                            {service.service_price} ₴
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">Базова ціна</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Ліва колонка - Опис послуги */}
                                                    <div className="lg:col-span-2 space-y-6">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                                                Опис послуги
                                                            </h3>
                                                            <p className="text-gray-700 leading-relaxed">
                                                                {service.description}
                                                            </p>
                                                        </div>

                                                        {/* Характеристики послуги */}
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Характеристики</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-blue-100 p-2 rounded-lg">
                                                                        <Clock className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Тривалість</p>
                                                                        <p className="font-bold text-gray-900">{service.duration} год</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-green-100 p-2 rounded-lg">
                                                                        <Shield className="w-5 h-5 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Гарантія</p>
                                                                        <p className="font-bold text-gray-900">{service.garantie_term} міс</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-orange-100 p-2 rounded-lg">
                                                                        <DollarSign className="w-5 h-5 text-orange-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Вартість</p>
                                                                        <p className="font-bold text-gray-900">{service.service_price} ₴</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Права колонка - Інформація про автосервіс */}
                                                    <div className="space-y-4">
                                                        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <Wrench className="w-5 h-5 text-blue-600" />
                                                                <h3 className="font-bold text-gray-900">Автомайстерня</h3>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-sm text-gray-600 mb-1">Назва</p>
                                                                    <p className="font-semibold text-gray-900">{service.autorepair_name}</p>
                                                                </div>

                                                                <div className="flex items-start gap-2">
                                                                    <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Телефон</p>
                                                                        <a
                                                                            href={`tel:${service.autorepair_phone}`}
                                                                            className="text-sm text-blue-600 hover:underline font-medium"
                                                                        >
                                                                            {service.autorepair_phone}
                                                                        </a>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start gap-2">
                                                                    <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Email</p>
                                                                        <a
                                                                            href={`mailto:${service.autorepair_email}`}
                                                                            className="text-sm text-blue-600 hover:underline font-medium break-all"
                                                                        >
                                                                            {service.autorepair_email}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Кнопка замовлення */}
                                                        <button
                                                            className="w-full px-6 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md text-lg"
                                                            onClick={() => navigate(`/autorepair/${service.autorepair_id}`)}
                                                        >
                                                            ЗАМОВИТИ ПОСЛУГУ
                                                        </button>

                                                        {/* Додаткова інформація */}
                                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                            <p className="text-xs text-amber-800">
                                                                💡 Ціна може змінюватися в залежності від моделі автомобіля та складності робіт
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ServicesStatistics />

                            {!loading && !error && services.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="text-gray-400 text-6xl mb-4">🔧</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Послуги не знайдено</h3>
                                    <p className="text-gray-500">Спробуйте змінити параметри пошуку або фільтрації</p>
                                </div>
                            )}
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesPage;