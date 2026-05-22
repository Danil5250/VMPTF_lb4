// AutoServiceFinder.tsx
import React, { useState } from 'react';
import { MapPin, Wrench, ChevronRight } from 'lucide-react';
import {useNavigate} from "react-router-dom";

export default function AutoServiceFinder() {
    const [location, setLocation] = useState('');
    const [service, setService] = useState('');

    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/autorepairs')
        console.log('Пошук:', { location, service });
    };

    return (
        <div className="w-full">
            <div
                className="w-full bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%231e293b" width="1200" height="600"/><g fill-opacity="0.05"><circle fill="%23fff" cx="200" cy="150" r="80"/><circle fill="%23fff" cx="800" cy="400" r="120"/><circle fill="%23fff" cx="1000" cy="200" r="60"/></g></svg>')`
                }}
            >
                <div className="p-6 md:p-8 lg:p-10">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                            Знаходь СТО і записуйся на
                        </h1>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            обслуговування!
                        </h1>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {/* Location Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                <MapPin size={20} />
                            </div>
                            <input
                                type="text"
                                onClick={() => {navigate('/autorepairs')}}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Введіть місто, район або вулицю..."
                                className="w-full pl-12 pr-4 py-3 md:py-4 rounded-lg bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Service Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                <Wrench size={20} />
                            </div>
                            <input
                                type="text"
                                onClick={() => {navigate('/services')}}
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                placeholder="Виберіть послугу, яка потрібна вашому автомобілю"
                                className="w-full pl-12 pr-12 py-3 md:py-4 rounded-lg bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                <ChevronRight size={20} />
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 md:py-4 px-8 rounded-lg uppercase tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        >
                            ПОШУК
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}