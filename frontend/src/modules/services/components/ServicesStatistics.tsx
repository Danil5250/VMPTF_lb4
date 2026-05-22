import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Clock, Shield, Phone, Mail, Building2, BarChart3 } from 'lucide-react';
import {getServicesStatistic} from "../api/servicePageService.ts";

interface ServiceStatistic {
    назва_послуги: string;
    опис_послуги: string;
    мінімальна_ціна: string;
    середня_ціна: string;
    назва_автомайстерні: string;
    базова_вартість: string;
    гарантійний_термін: number;
    тривалість: number;
    телефон_автомайстерні: string;
    email_автомайстерні: string;
}

const ServicesStatistics: React.FC = () => {
    const [statistics, setStatistics] = useState<ServiceStatistic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const response = await getServicesStatistic();
                setStatistics(response.data);
            } catch (err) {
                console.error('Error loading statistics:', err);
                setError('Не вдалося завантажити статистику');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-blue-400 text-6xl mb-4">⏳</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Завантаження статистики...</h3>
        <p className="text-gray-500">Зачекайте, будь ласка</p>
        </div>
        </div>
    );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">{error}</h3>
            </div>
            </div>
    );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
    <BarChart3 className="w-8 h-8 text-blue-600" />
    <h1 className="text-3xl font-bold text-gray-900">Статистика послуг автомайстерень</h1>
    </div>
    <p className="text-gray-600 leading-relaxed">
        Детальна аналітика цін, умов та характеристик послуг від різних автомайстерень
    </p>
    </div>

    {/* Statistics Cards */}
    <div className="grid gap-6">
        {statistics.map((stat, index) => (
                <div
                    key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
            {/* Header with Service Name */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-indigo-200">
            <div className="flex items-start justify-between">
            <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {stat.назва_послуги}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
            {stat.опис_послуги}
            </p>
            </div>
            </div>
            </div>

            <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Price Statistics */}
                <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
                Цінова статистика
                </h3>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
    <div className="flex items-center justify-between mb-2">
    <span className="text-xs text-green-600 font-medium">Мінімальна ціна</span>
    <TrendingUp className="w-4 h-4 text-green-600" />
        </div>
        <p className="text-2xl font-bold text-green-700">
        {parseFloat(stat.мінімальна_ціна).toFixed(2)} ₴
    </p>
    </div>

    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
    <div className="flex items-center justify-between mb-2">
    <span className="text-xs text-blue-600 font-medium">Середня ціна</span>
    <BarChart3 className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-blue-700">
        {parseFloat(stat.середня_ціна).toFixed(2)} ₴
    </p>
    </div>

    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
    <div className="flex items-center justify-between mb-2">
    <span className="text-xs text-purple-600 font-medium">Базова вартість</span>
    <DollarSign className="w-4 h-4 text-purple-600" />
        </div>
        <p className="text-2xl font-bold text-purple-700">
        {parseFloat(stat.базова_вартість).toFixed(2)} ₴
    </p>
    </div>
    </div>

    {/* Service Characteristics */}
    <div className="space-y-4">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Характеристики послуги
    </h3>

    <div className="bg-gray-50 rounded-lg p-4">
    <div className="space-y-4">
    <div className="flex items-center gap-3">
    <div className="bg-orange-100 p-2 rounded-lg">
    <Clock className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1">
    <p className="text-xs text-gray-500">Тривалість виконання</p>
    <p className="font-bold text-gray-900">{stat.тривалість} год</p>
    </div>
    </div>

    <div className="flex items-center gap-3">
    <div className="bg-emerald-100 p-2 rounded-lg">
    <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
    <p className="text-xs text-gray-500">Гарантійний термін</p>
    <p className="font-bold text-gray-900">{stat.гарантійний_термін} міс</p>
    </div>
    </div>
    </div>
    </div>

    {/* Price Difference Indicator */}
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <p className="text-xs text-amber-800 font-medium mb-2">💡 Економія</p>
    <p className="text-sm text-amber-700">
        Різниця між мінімальною та середньою: {' '}
    <span className="font-bold">
        {(parseFloat(stat.середня_ціна) - parseFloat(stat.мінімальна_ціна)).toFixed(2)} ₴
    </span>
    </p>
    </div>
    </div>

    {/* Workshop Information */}
    <div className="space-y-4">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
    <Building2 className="w-4 h-4" />
        Автомайстерня
        </h3>

        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
    <div className="space-y-4">
    <div>
        <p className="text-sm text-gray-600 mb-1">Назва</p>
        <p className="font-bold text-gray-900 text-lg">
        {stat.назва_автомайстерні}
        </p>
        </div>

        <div className="pt-3 border-t border-blue-200 space-y-3">
    <div className="flex items-start gap-2">
    <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
    <div>
        <p className="text-xs text-gray-500">Телефон</p>
        <a
    href={`tel:${stat.телефон_автомайстерні}`}
    className="text-sm text-blue-600 hover:underline font-medium"
        >
        {stat.телефон_автомайстерні}
        </a>
        </div>
        </div>

        <div className="flex items-start gap-2">
    <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
    <div>
        <p className="text-xs text-gray-500">Email</p>
        <a
    href={`mailto:${stat.email_автомайстерні}`}
    className="text-sm text-blue-600 hover:underline font-medium break-all"
        >
        {stat.email_автомайстерні}
        </a>
        </div>
        </div>
        </div>
        </div>
        </div>

    {/* Action Button */}
    {/*<button*/}
    {/*    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md text-sm"*/}
    {/*    >*/}
    {/*    ДЕТАЛЬНІШЕ ПРО ПОСЛУГУ*/}
    {/*</button>*/}
    </div>
    </div>
    </div>
    </div>
))}
    </div>

    {statistics.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Статистика відсутня</h3>
    <p className="text-gray-500">Наразі немає даних для відображення</p>
    </div>
    )}
    </div>
);
};

export default ServicesStatistics;