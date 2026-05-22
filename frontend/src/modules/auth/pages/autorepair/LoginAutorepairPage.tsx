import React, { useState } from 'react';
import { X, Eye, EyeOff, Wrench } from 'lucide-react';
import {LoginAutorepair} from "../../api/AuthApi.ts";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

const AutoWorkshopLogin = ({onClose}:{onClose : () => void}) => {
    const [workshopName, setWorkshopName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {

        if (workshopName && password) {
            try {

                if(workshopName == "admin" && password == "admin") {
                    navigate("/admin");
                    return;
                }

                const result = await LoginAutorepair(workshopName, password);
                navigate(`/autorepair-cabinet/${result.data.autorepair_id}`)
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Спробуйте ще раз",
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Назва майстерні та пароль мають бути задані!",
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
            {/* Close button */}
            <button
    onClick={() => onClose()}
    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
    aria-label="Close"
    >
    <X size={24} />
    </button>

    {/* Modal content */}
    <div className="p-8">
        {/* Icon and Title */}
        <div className="flex flex-col items-center mb-8">
    <div className="bg-orange-100 p-4 rounded-full mb-4">
    <Wrench size={32} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-center">Вхід для автомайстерні</h2>
    </div>

    {/* Login form */}
    <div>
        {/* Workshop Name field */}
    <div className="mb-4">
    <label htmlFor="workshopName" className="block text-sm font-medium mb-2">
        Назва автомайстерні
    </label>
    <input
    type="text"
    id="workshopName"
    value={workshopName}
    onChange={(e) => setWorkshopName(e.target.value)}
    placeholder="Введіть назву вашої майстерні"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        </div>

    {/* Password field */}
    <div className="mb-2">
    <label htmlFor="password" className="block text-sm font-medium mb-2">
        Пароль
        </label>
        <div className="relative">
    <input
        type={showPassword ? 'text' : 'password'}
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Введіть пароль"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
    />
    <button
        type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
        >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>
        </div>

    {/* Forgot password link */}
    <div className="text-right mb-6">
    <a href="#" className="text-sm text-blue-600 hover:underline">
        Забули пароль?
        </a>
        </div>

        {/* Submit button */}
        <button
    onClick={handleSubmit}
    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors uppercase"
        >
        Увійти
        </button>
        </div>

    {/* Sign up link */}
    <div className="text-center mt-6 text-sm">
    <span className="text-gray-600">Ще не зареєстровані?</span>{' '}
        <button
        onClick={() => console.log('Перейти до реєстрації')}
    className="text-blue-600 hover:underline"
        >
        Зареєструвати майстерню
    </button>
    </div>
    </div>
    </div>
    </div>
);
};

export default AutoWorkshopLogin;