import {MoreVertical, Plus, Search, Calendar, Shield, Wrench, Gauge} from "lucide-react";
import React, {useEffect, useState} from "react";
import {getAllCarsByClientId} from "../api/clientMainApi.ts";
import {useAuth} from "../../components/auth/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import AddCarForm from "./AddCar.tsx";

interface Car {
    brand: string;
    model: string;
    engine_type: string;
    year: string;
    insurance: string;
    license_plate: string;
    vin: string;
}

const ClientsGarage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth()
    const [cars, setCars] = useState<Car[]>([]);
    const navigate = useNavigate();
    const [showAddCarModal, setShowAddCarModal] = useState(false);


    const fetchCars = async () => {
        try {
            if(user.id) {
                const result = await getAllCarsByClientId(user.id)
                setCars(result.data)
            }
        }
        catch (err) {

        }
    }

    useEffect(() => {
        fetchCars();
    }, []);


    useEffect(() => {
        fetchCars();
    }, [showAddCarModal]);

    const filteredCars = cars.filter(car =>
        car.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setShowAddCarModal(true)}
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Додати транспортний засіб</span>
                    </button>

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

            {/* Car Card */}
            <div className="p-8">
                {filteredCars.length > 0 ? (
                    <div className="space-y-6">
                        {filteredCars.map((car, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <div className="flex gap-6">
                                        {/* Car Image */}
                                        <div className="w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 flex items-center justify-center flex-shrink-0">
                                            <img
                                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Cg transform='translate(50,80)'%3E%3Cellipse cx='100' cy='0' rx='120' ry='35' fill='%23999'/%3E%3Cpath d='M20,-20 L40,-40 L160,-40 L180,-20 Z' fill='%23aaa'/%3E%3Crect x='10' y='-20' width='180' height='50' rx='8' fill='%23bbb'/%3E%3Cpath d='M50,-35 L70,-35 L70,-10 L55,-10 Z' fill='%23333'/%3E%3Cpath d='M80,-35 L130,-35 L140,-10 L80,-10 Z' fill='%23333'/%3E%3Ccircle cx='40' cy='35' r='20' fill='%23222'/%3E%3Ccircle cx='40' cy='35' r='12' fill='%23666'/%3E%3Ccircle cx='160' cy='35' r='20' fill='%23222'/%3E%3Ccircle cx='160' cy='35' r='12' fill='%23666'/%3E%3C/g%3E%3C/svg%3E"
                                                alt={`${car.brand} ${car.model}`}
                                                className="w-full h-full object-contain opacity-80"
                                            />
                                        </div>

                                        {/* Car Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                        {car.brand} {car.model}
                                                    </h2>
                                                    <p className="text-gray-500 font-medium">{car.year} рік</p>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                <div className="flex items-start gap-3">
                                                    <Gauge className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">Двигун</p>
                                                        <p className="text-gray-900 font-semibold">{car.engine_type}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">Номерний знак</p>
                                                        <p className="text-gray-900 font-bold text-lg tracking-wide">
                                                            {car.license_plate}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">VIN</p>
                                                        <p className="text-gray-900 font-mono text-sm">{car.vin}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">Рік випуску</p>
                                                        <p className="text-gray-900 font-semibold">{car.year}</p>
                                                    </div>
                                                </div>

                                                {/* Additional Info */}
                                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Страховка до</p>
                                                        </div>
                                                        <p className="text-gray-400">{car.insurance ?? "Не вказано"}</p>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Action Buttons */}
                                            <div className="flex gap-4">
                                                <button className="flex-1 px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                                                    <Wrench className="w-5 h-5" />
                                                    ПЕРЕЙТИ ДО СЕРВІСНОЇ КНИЖКИ
                                                </button>
                                                <button
                                                    className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                                    onClick={() => navigate('/autorepairs')}
                                                >
                                                    <Calendar className="w-5 h-5" />
                                                    ЗАЙНЯТИ АВТОСЕРВІС
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {searchQuery ?
                            `Не знайдено автомобілів з номерним знаком "${searchQuery}"` :
                            "Наразі ви не маєте жодного автомобіля. Додайте автомобіль за допомогою кнопки вгорі"
                        }
                    </p>
                )
                }

            </div>
            {
                showAddCarModal && (
                    <AddCarForm setShowForm={setShowAddCarModal} />
                )
            }
        </main>
    )
}


export default ClientsGarage