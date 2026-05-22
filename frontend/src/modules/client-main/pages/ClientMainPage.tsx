import React, { useState } from 'react';
import { Calendar, Car, User } from 'lucide-react';
import ClientsVisits from "../components/ClientsVisits.tsx";
import ClientsGarage from "../components/ClientsGarage.tsx";
import ClientsProfile from "../components/ClientsProfile.tsx";
import Header from "../../components/header/Header.tsx";

const ClientMainPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('booking');

    return (
        <div className="flex h-screen bg-gray-50 py-25">
            <Header />
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveSection('booking')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeSection === 'booking'
                                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Бронювання</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('garage')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeSection === 'garage'
                                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Car className="w-5 h-5" />
                        <span className="font-medium">Мій гараж</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeSection === 'profile'
                                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Профіль</span>
                    </button>
                </nav>
            </aside>

            {activeSection === 'booking' && (
                <ClientsVisits />
            )}

            {activeSection === 'garage' && (
                <ClientsGarage />
            )}

            {activeSection === 'profile' && (
                <ClientsProfile />
            )}
        </div>
    );
};

export default ClientMainPage;