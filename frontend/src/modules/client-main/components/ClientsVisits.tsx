import {ChevronDown, Search, Calendar, Clock, CreditCard, Car, MapPin, Phone, Mail, AlertCircle, CheckCircle} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getAllVisitsByClientId} from "../api/clientMainApi.ts";
import {useAuth} from "../../components/auth/AuthContext.tsx";
import Swal from 'sweetalert2'
import BookVisitUpdate from "./BookVisitUpdate.tsx";

interface Visit {
    visit_id: number;
    date_time: Date;
    alternative_date_time: Date | null;
    note: string | null;
    payment_way: string;
    payment_status: string;
    is_completed: boolean;
    is_urgent: boolean;
    brand: string;
    model: string;
    engine_type: string;
    year: string;
    license_plate: string;
    vin: string;
    autorepair_name: string;
    autorepair_adress: string;
    autorepair_phone: string;
    autorepair_email: string;
}

const ClientsVisits = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()
    const [visits, setVisits] = useState<Visit[]>([]);
    const [showBookVisitUpdate, setShowBookVisitUpdate] = useState(-1);

    const fetchVisits = async () => {
        try {
            if(user.id) {
                console.log(user.id)
                const result = await getAllVisitsByClientId(user.id)
                setVisits(result.data)
                setLoading(false)
            }
        }
        catch (error) {
            // if(error.response?.status != 403) {
            //     const msg =
            //         error.response?.data?.message ||
            //         error.response?.data?.error ||
            //         "Щось пішло не так спробуйте ще раз"
            //
            //     await Swal.fire({
            //         icon: "error",
            //         title: "Помилка",
            //         text: msg,
            //     });
            // }
        }
    }

    useEffect(() => {


        fetchVisits()
    }, [])

    const filteredVisits = visits.filter(visit =>
        visit.license_plate.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const formatDate = (date: Date) => {
        if(date)
        return new Date(date).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        else
            return "Не вирішена"
    };

    const formatTime = (date: Date) => {
        if(date)
        return new Date(date).toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        else
            return "Не вирішений"
    };

    const getPaymentStatusColor = (status: string) => {
        const colors = {
            'paid': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'unpaid': 'bg-red-100 text-red-800'
        };
        return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusText = (status: string) => {
        const texts = {
            'paid': 'Оплачено',
            'pending': 'Очікує оплати',
            'unpaid': 'Не оплачено'
        };
        return texts[status.toLowerCase()] || status;
    };

    if (loading) return <div>Loading...</div>;



    return(
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Пошук за номерним знаком"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                </div>
            </header>

            {
                Array.isArray(filteredVisits) && filteredVisits.length > 0 ?
                    (
                        <div className="space-y-6">
                            {filteredVisits.map(visit => (
                                <div key={visit.visit_id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                                    {/* Header with status */}
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-gray-900">{visit.autorepair_name}</h3>
                                                {visit.is_urgent && (
                                                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Терміново
                                                        </span>
                                                )}
                                                {visit.is_completed && (
                                                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Завершено
                                                        </span>
                                                )}
                                            </div>
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                                                onClick={() => setShowBookVisitUpdate(visit.visit_id)}
                                            >
                                                Оновити
                                            </button>

                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(visit.payment_status)}`}>
                                                    {getPaymentStatusText(visit.payment_status)}
                                                </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Left Column - Visit Details */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Деталі візиту</h4>

                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Дата візиту</p>
                                                                <p className="font-semibold text-gray-900">{formatDate(visit.date_time)}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Час</p>
                                                                <p className="font-semibold text-gray-900">{formatTime(visit.date_time)}</p>
                                                                {visit.alternative_date_time && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        Альтернативний час: {formatTime(visit.alternative_date_time)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Спосіб оплати</p>
                                                                <p className="font-semibold text-gray-900">{visit.payment_way}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {visit.note && (
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                        <p className="text-sm font-semibold text-amber-900 mb-1">Примітка</p>
                                                        <p className="text-sm text-amber-800">{visit.note}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Column - Car & Service Details */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Автомобіль</h4>

                                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Car className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <p className="font-bold text-lg text-gray-900">
                                                                    {visit.brand} {visit.model}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {visit.year} • {visit.engine_type}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Номерний знак</p>
                                                                <p className="font-semibold text-gray-900">{visit.license_plate}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">VIN</p>
                                                                <p className="font-mono text-sm text-gray-900">{visit.vin}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Контакти автомайстерні</h4>

                                                    <div className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-sm text-gray-700">{visit.autorepair_adress}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                            <a href={`tel:${visit.autorepair_phone}`} className="text-sm text-blue-600 hover:underline">
                                                                {visit.autorepair_phone}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                            <a href={`mailto:${visit.autorepair_email}`} className="text-sm text-blue-600 hover:underline">
                                                                {visit.autorepair_email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    :
                    (
                        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-8">
                            {/* Empty State */}
                            <div className="max-w-2xl text-center">
                                {/* Illustration */}
                                <div className="mb-8">
                                    <svg className="w-full max-w-md mx-auto" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Car lift structure */}
                                        <rect x="120" y="50" width="8" height="220" fill="#E5E7EB" />
                                        <rect x="472" y="50" width="8" height="220" fill="#E5E7EB" />

                                        {/* Car body */}
                                        <path d="M200 120 L240 100 L360 100 L400 120 L420 140 L420 200 L180 200 L180 140 Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="3" />

                                        {/* Car windows */}
                                        <path d="M250 105 L280 105 L280 140 L255 140 Z" fill="#E5E7EB" />
                                        <path d="M290 105 L350 105 L365 140 L290 140 Z" fill="#E5E7EB" />

                                        {/* Car details */}
                                        <rect x="190" y="150" width="220" height="30" fill="#D1D5DB" />
                                        <line x1="300" y1="120" x2="300" y2="200" stroke="#9CA3AF" strokeWidth="2" />

                                        {/* Wheels */}
                                        <circle cx="240" cy="220" r="30" fill="#374151" />
                                        <circle cx="240" cy="220" r="18" fill="#6B7280" />
                                        <circle cx="360" cy="220" r="30" fill="#374151" />
                                        <circle cx="360" cy="220" r="18" fill="#6B7280" />

                                        {/* Mechanic 1 */}
                                        <circle cx="160" cy="200" r="20" fill="#3B82F6" />
                                        <rect x="150" y="220" width="20" height="40" rx="4" fill="#3B82F6" />
                                        <rect x="145" y="230" width="10" height="30" rx="3" fill="#3B82F6" />
                                        <rect x="165" y="230" width="10" height="30" rx="3" fill="#3B82F6" />
                                        <line x1="170" y1="210" x2="200" y2="230" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />

                                        {/* Mechanic 2 */}
                                        <circle cx="440" cy="200" r="20" fill="#3B82F6" />
                                        <rect x="430" y="220" width="20" height="40" rx="4" fill="#3B82F6" />
                                        <rect x="425" y="230" width="10" height="30" rx="3" fill="#3B82F6" />
                                        <rect x="445" y="230" width="10" height="30" rx="3" fill="#3B82F6" />
                                        <line x1="430" y1="210" x2="400" y2="230" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />

                                        {/* Tools */}
                                        <circle cx="200" cy="240" r="8" fill="#60A5FA" />
                                        <circle cx="400" cy="240" r="8" fill="#60A5FA" />
                                    </svg>
                                </div>

                                {/* Text content */}
                                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                    Наразі ви не маєте жодного бронювання. Якщо ваш автомобіль<br />
                                    потребує ремонту, перегляньте наш список надійних<br />
                                    автомайстерень та забронюйте візит онлайн.
                                </p>

                                {/* CTA Button */}
                                <button
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
                                    onClick={() => navigate('/autorepairs')}
                                >
                                    ЗАБРОНЮВАТИ ВІЗИТ
                                </button>
                            </div>
                        </div>
                    )
            }

            {showBookVisitUpdate !== -1 && (
                <BookVisitUpdate
                    visitId={showBookVisitUpdate}
                    onClose={() => {
                        setShowBookVisitUpdate(-1);
                        fetchVisits()
                    }}
                />
            )}


        </main>
    )
}

export default ClientsVisits;
