import { TrendingUp, DollarSign, ShoppingCart, Award, Phone, Mail, MapPin, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { topMostIncomedServicesForAutorepair } from "../api/AutorepairsCabinetApi.ts";
import { useParams } from "react-router-dom";
import VisitEdit from "./VisitEdit.tsx";
import SpecializationManager from "../../specialization/components/SpecializationManager.tsx";
import AutorepairServiceManager from "../../autorepair-services/components/AutorepairServiceManager.tsx";

interface ServiceStatistic {
    service_name: string;
    times_ordered: number;
    total_revenue: number;
    autorepair_id: number;
    "Назва автомайстерні": string;
    adress: string;
    phone: string;
    email: string;
}

const AutorepairCabinet = () => {
    const { id } = useParams();
    const [services, setServices] = useState<ServiceStatistic[]>([]);

    const [count, setCount] = useState(5);

    useEffect(() => {
        const fetchMostIncomedServices = async () => {
            try {
                if (id) {
                    console.log(id);
                    const result = await topMostIncomedServicesForAutorepair(+id, count);
                    console.log(result);
                    setServices(result.data)
                }

            } catch (error) {
            }
        }

        fetchMostIncomedServices();
    }, [count]);


    const formatCurrency = (amount: number) => {
        return amount?.toLocaleString('uk-UA') + ' ₴';
    };

    const getTopBadge = (index: number) => {
        const badges = [
            { color: 'bg-yellow-500', icon: '🥇', text: 'TOP 1' },
            { color: 'bg-gray-400', icon: '🥈', text: 'TOP 2' },
            { color: 'bg-orange-600', icon: '🥉', text: 'TOP 3' }
        ];
        return badges[index] || null;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">

                <VisitEdit
                    autorepairId={+id!}
                />

                {/* Specialization Management Section */}
                <div className="mb-8">
                    <SpecializationManager autorepairId={+id!} />
                </div>

                <div className="mb-8">
                    <AutorepairServiceManager autorepairId={+id!} />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                                Статистика найприбутковіших послуг
                            </h1>
                            <p className="text-gray-600">Топ послуг за загальним доходом від завершених візитів</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Показати топ:</label>
                            <select
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value={5}>5 послуг</option>
                                <option value={10}>10 послуг</option>
                                <option value={20}>20 послуг</option>
                                <option value={50}>50 послуг</option>
                            </select>
                        </div>
                    </div>
                </div>



                {/* Statistics Cards */}
                <div className="space-y-6">
                    {services.slice(0, count).map((stat, index) => {
                        const topBadge = getTopBadge(index);
                        const avgRevenue = (stat.total_revenue / stat.times_ordered).toFixed(2);

                        return (
                            <div
                                key={`${stat.autorepair_id}-${stat.service_name}`}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
                            >
                                {/* Позиція та основна інформація */}
                                <div
                                    className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-6 py-4 border-b border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Номер позиції */}
                                            <div
                                                className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md border-2 border-blue-300">
                                                <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                                            </div>

                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                    {stat.service_name}
                                                </h2>
                                                {topBadge && (
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 ${topBadge.color} text-white text-sm font-bold rounded-full`}>
                                                        {topBadge.icon} {topBadge.text}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Загальний дохід */}
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Загальний дохід</p>
                                            <div className="text-4xl font-bold text-green-600">
                                                {formatCurrency(stat.total_revenue)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Ліва колонка - Статистика */}
                                        <div className="lg:col-span-2">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                                Показники ефективності
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Кількість замовлень */}
                                                <div
                                                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="bg-blue-600 p-2 rounded-lg">
                                                            <ShoppingCart className="w-5 h-5 text-white" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-600">Замовлень</p>
                                                    </div>
                                                    <p className="text-3xl font-bold text-gray-900">{stat.times_ordered}</p>
                                                    <p className="text-xs text-gray-500 mt-1">послуги</p>
                                                </div>

                                                {/* Середній чек */}
                                                <div
                                                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="bg-green-600 p-2 rounded-lg">
                                                            <DollarSign className="w-5 h-5 text-white" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-600">Середній
                                                            чек</p>
                                                    </div>
                                                    <p className="text-3xl font-bold text-gray-900">{avgRevenue} ₴</p>
                                                    <p className="text-xs text-gray-500 mt-1">На одне замовлення</p>
                                                </div>

                                                {/* Загальний дохід */}
                                                <div
                                                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="bg-orange-600 p-2 rounded-lg">
                                                            <Award className="w-5 h-5 text-white" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-600">Всього
                                                            дохід</p>
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stat.total_revenue)}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Сумарний</p>
                                                </div>
                                            </div>

                                            {/* Прогрес бар */}
                                            <div className="mt-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span
                                                        className="text-sm font-medium text-gray-600">Частка від топ-1</span>
                                                    <span className="text-sm font-bold text-blue-600">
                                                        {((stat.total_revenue / services[0].total_revenue) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${(stat.total_revenue / services[0].total_revenue) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Права колонка - Автомайстерня */}
                                        <div>
                                            <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50 h-full">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                    <h3 className="font-bold text-gray-900">Автомайстерня</h3>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Назва</p>
                                                        <p className="font-semibold text-gray-900 text-lg">
                                                            {stat["Назва автомайстерні"]}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className="flex items-start gap-2 pt-2 border-t border-blue-200">
                                                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Адреса</p>
                                                            <p className="text-sm text-gray-700">{stat.adress}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Телефон</p>
                                                            <a
                                                                href={`tel:${stat.phone}`}
                                                                className="text-sm text-blue-600 hover:underline font-medium"
                                                            >
                                                                {stat.phone}
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Email</p>
                                                            <a
                                                                href={`mailto:${stat.email}`}
                                                                className="text-sm text-blue-600 hover:underline font-medium break-all"
                                                            >
                                                                {stat.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                {services.length > 0 && (() => {

                    let totalOrders = 0;
                    let totalIncome = 0;
                    for (const service of services) {
                        totalOrders += Number(service.times_ordered || 0);
                        totalIncome += Number(service.total_revenue || 0);
                    }

                    return (
                        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-blue-200 text-sm mb-1">Всього послуг у топі</p>
                                    <p className="text-4xl font-bold">{services.slice(0, count).length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-blue-200 text-sm mb-1">Загальна кількість замовлень</p>
                                    <p className="text-4xl font-bold">
                                        {totalOrders}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-blue-200 text-sm mb-1">Сумарний дохід</p>
                                    <p className="text-4xl font-bold">
                                        {totalIncome}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })()}

                {/* Empty State */}
                {services.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <TrendingUp className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Статистика відсутня</h3>
                        <p className="text-gray-500 text-lg">
                            Наразі немає даних про завершені візити
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutorepairCabinet;