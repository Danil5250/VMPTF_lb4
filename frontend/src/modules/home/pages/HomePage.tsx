import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import Header from "../../components/header/Header.tsx";
import { Users, TrendingUp, DollarSign, Calendar, Award, Crown, Star } from "lucide-react";
import {getTopActiveUsers} from "../api/homePageApi.ts";


interface ClientStatistic {
    client_full_name: string;
    visits_count: number;
    total_spent: number;
    average_price_visit: number;
}


const HomePage: React.FC = () => {
    const [clientStat, setClientStat] = useState<ClientStatistic[]>([]);

    const [count, setCount] = useState(5);

    useEffect(() => {
        const fetchClientStat = async () => {
            try {
                const result = await getTopActiveUsers(count);
                console.log(result.data)
                setClientStat(result.data);
            } catch (error) {}
        }


        fetchClientStat();
    }, [count])

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('uk-UA') + ' ₴';
    };

    const getTopBadge = (index: number) => {
        const badges = [
            { color: 'from-yellow-400 to-yellow-600', icon: <Crown className="w-6 h-6" />, text: 'VIP CLIENT', ring: 'ring-yellow-400' },
            { color: 'from-gray-300 to-gray-500', icon: <Award className="w-6 h-6" />, text: 'PREMIUM', ring: 'ring-gray-400' },
            { color: 'from-orange-400 to-orange-600', icon: <Star className="w-6 h-6" />, text: 'GOLD', ring: 'ring-orange-400' }
        ];
        return badges[index] || null;
    };

    const getAvatarColor = (index: number) => {
        const colors = [
            'from-blue-400 to-blue-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-green-400 to-green-600',
            'from-indigo-400 to-indigo-600',
            'from-red-400 to-red-600',
            'from-teal-400 to-teal-600',
            'from-orange-400 to-orange-600'
        ];
        return colors[index % colors.length];
    };

    const getInitials = (fullName: string) => {
        if(fullName) {
            const names = fullName.split(' ');
            return names.map(name => name.charAt(0)).join('').toUpperCase();
        }
        return 'UNKNOWN'
    };




    return (
        <>
            <div className="max-w-full">
                <Header/>
            </div>
            <main className="min-h-screen">

                <HeroSection />
            </main>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-blue-600" />
                                    Топ активних клієнтів
                                </h1>
                                <p className="text-gray-600">Рейтинг клієнтів за загальною сумою витрат на послуги</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">Показати топ:</label>
                                <select
                                    value={count}
                                    onChange={(e) => setCount(Number(e.target.value))}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value={5}>5 клієнтів</option>
                                    <option value={10}>10 клієнтів</option>
                                    <option value={20}>20 клієнтів</option>
                                    <option value={50}>50 клієнтів</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Podium для топ-3 */}
                    {clientStat.length >= 3 && (
                        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                            <div className="flex items-end justify-center gap-8">
                                {/* 2 місце */}
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor(1)} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-gray-300`}>
                                            {getInitials(clientStat[1].client_full_name)}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-gray-300 to-gray-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                            2
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{clientStat[1].client_full_name}</h3>
                                    <p className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(clientStat[1].total_spent)}</p>
                                    <p className="text-sm text-gray-500">{clientStat[1].visits_count} візитів</p>
                                    <div className="mt-4 w-32 h-24 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-center justify-center shadow-inner">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* 1 місце */}
                                <div className="flex flex-col items-center -mt-8">
                                    <div className="relative mb-4">
                                        <div className={`w-32 h-32 bg-gradient-to-br ${getAvatarColor(0)} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-yellow-400 animate-pulse`}>
                                            {getInitials(clientStat[0].client_full_name)}
                                        </div>
                                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                                            1
                                        </div>
                                        <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-xl mb-1">{clientStat[0].client_full_name}</h3>
                                    <p className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(clientStat[0].total_spent)}</p>
                                    <p className="text-sm text-gray-500">{clientStat[0].visits_count} візитів</p>
                                    <div className="mt-4 w-32 h-32 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-center justify-center shadow-lg">
                                        <Crown className="w-10 h-10 text-white" />
                                    </div>
                                </div>

                                {/* 3 місце */}
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor(2)} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-orange-400`}>
                                            {getInitials(clientStat[2].client_full_name)}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-orange-400 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                            3
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{clientStat[2].client_full_name}</h3>
                                    <p className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(clientStat[2].total_spent)}</p>
                                    <p className="text-sm text-gray-500">{clientStat[2].visits_count} візитів</p>
                                    <div className="mt-4 w-32 h-20 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-center justify-center shadow-inner">
                                        <Star className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Список всіх клієнтів */}
                    <div className="space-y-4">
                        {clientStat.slice(0, count).map((client, index) => {
                            const topBadge = getTopBadge(index);

                            return (
                                <div
                                    key={`${client.client_full_name}-${index}`}
                                    className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all overflow-hidden ${
                                        topBadge ? `border-transparent ring-2 ${topBadge.ring}` : 'border-gray-200'
                                    }`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-6">
                                            {/* Позиція та аватар */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full font-bold text-xl text-gray-600">
                                                    #{index + 1}
                                                </div>

                                                <div className={`relative w-16 h-16 bg-gradient-to-br ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                                                    {getInitials(client.client_full_name)}
                                                    {topBadge && (
                                                        <div className={`absolute -top-2 -right-2 bg-gradient-to-br ${topBadge.color} text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg`}>
                                                            {topBadge.icon}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Інформація про клієнта */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {client.client_full_name}
                                                    </h3>
                                                    {topBadge && (
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${topBadge.color} text-white text-xs font-bold rounded-full shadow-md`}>
                                                        {topBadge.text}
                                                    </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm text-gray-600">
                                                        <span className="font-semibold text-gray-900">{client.visits_count}</span> завершених візитів
                                                    </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm text-gray-600">
                                                        Середній чек: <span className="font-semibold text-gray-900">{Math.round(client.average_price_visit)} ₴</span>
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Загальна сума витрат */}
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">Загальна сума витрат</p>
                                                <div className="text-3xl font-bold text-green-600">
                                                    {formatCurrency(client.total_spent)}
                                                </div>
                                            </div>

                                            {/* Прогрес від топ-1 */}
                                            <div className="w-24">
                                                <div className="relative w-20 h-20">
                                                    <svg className="transform -rotate-90 w-20 h-20">
                                                        <circle
                                                            cx="40"
                                                            cy="40"
                                                            r="32"
                                                            stroke="#E5E7EB"
                                                            strokeWidth="8"
                                                            fill="none"
                                                        />
                                                        <circle
                                                            cx="40"
                                                            cy="40"
                                                            r="32"
                                                            stroke="#3B82F6"
                                                            strokeWidth="8"
                                                            fill="none"
                                                            strokeDasharray={`${(client.total_spent / clientStat[0].total_spent) * 200} 200`}
                                                            className="transition-all duration-500"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {((client.total_spent / clientStat[0].total_spent) * 100).toFixed(0)}%
                                                    </span>
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
                    {clientStat.length > 0 && (() => {
                        const visibleClients = clientStat.slice(0, count);

                        const totalClients = visibleClients.length;

                        const totalVisits = visibleClients.reduce(
                            (sum, client) => sum + Number(client.visits_count || 0),
                            0
                        );

                        const totalSpent = visibleClients.reduce(
                            (sum, client) => sum + Number(client.total_spent || 0),
                            0
                        );

                        const averageCheck =
                            visibleClients.length > 0
                                ? Math.round(
                                    visibleClients.reduce(
                                        (sum, client) => sum + Number(client.average_price_visit ?? 0),
                                        0
                                    ) / visibleClients.length
                                )
                                : 0;


                        return (
                            <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm mb-1">Всього клієнтів</p>
                                        <p className="text-4xl font-bold">{totalClients}</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm mb-1">Загальна кількість візитів</p>
                                        <p className="text-4xl font-bold">
                                            {totalVisits}
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm mb-1">Сумарні витрати</p>
                                        <p className="text-4xl font-bold">
                                            {formatCurrency(totalSpent)}
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-blue-200 text-sm mb-1">Середній чек</p>
                                        <p className="text-4xl font-bold">
                                            {formatCurrency(averageCheck)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}



                    {/* Empty State */}
                    {clientStat.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                            <Users className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">Статистика відсутня</h3>
                            <p className="text-gray-500 text-lg">
                                Наразі немає даних про активних клієнтів
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default HomePage;