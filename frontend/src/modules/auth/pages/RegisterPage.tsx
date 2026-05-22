import React, { useState } from 'react';
import { X, Eye, EyeOff, ChevronLeft, Check } from 'lucide-react';
import {RegisterClient} from "../api/AuthApi.ts";

const SignUpModal = ({setShowLoginModal,
                                   setShowRegisterModal}:
                               {setShowLoginModal : (value: boolean) => void, setShowRegisterModal: (value: boolean) => void}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptNews, setAcceptNews] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async() => {
        if(login.length < 3 || email.length < 3 || password.length < 3) {
            setErrorMessage('Лоґін, email та пароль мають бути більше 3 символів');
            setShowError(true);
        }
        try {
            await RegisterClient({
                login,
                email,
                password
            })
            setShowSuccess(true);
            setShowError(false);
            setEmail('');
            setPassword('');
            setAcceptNews(false);
            setAcceptTerms(false);
        }
        catch (error) {
            setErrorMessage(error?.message || 'Щось пішло не так. Спробуйте ще раз.');
            setShowError(true);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => {
                            setShowLoginModal(false);
                            setShowRegisterModal(false);
                        }}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        aria-label="Back"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold">Налаштуйте обліковий запис</h2>
                    <button
                        onClick={() => {
                            setShowLoginModal(false);
                            setShowRegisterModal(false);
                        }}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} onClick={() => setShowRegisterModal(false)} />
                    </button>
                </div>

                {/* Modal content */}
                <div className="p-6">
                    {/* Email field */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Login
                        </label>
                        <input
                            type="login"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Адреса електронної пошти
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Password field */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>


                    {/* Checkboxes */}
                    <div className="space-y-3 mb-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptNews}
                                onChange={(e) => setAcceptNews(e.target.checked)}
                                className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">
                Так, я хочу бути в курсі автомобільних новин, пропозицій і знижок для мого автомобіля.
              </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">
                Я приймаю{' '}
                                <a href="#" className="text-blue-600 hover:underline">
                  Правила сервісу
                </a>{' '}
                                <span className="text-red-500">*</span>
              </span>
                        </label>
                    </div>



                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!acceptTerms || email.length < 3 || password.length < 3}
                        className={`w-full py-3 px-4 rounded-lg font-bold uppercase transition-colors ${
                            acceptTerms && email.length >= 3 && password.length >= 3
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Створити обліковий запис
                    </button>

                    <div className="text-center mt-6 text-sm">
                        <span className="text-gray-600">Маєте обліковий запис?</span>{' '}
                        <button
                            onClick={() => {
                                setShowLoginModal(true);
                                setShowRegisterModal(false);
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            Увійдіть тут
                        </button>
                    </div>
                </div>
            </div>
            {showError && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <button onClick={() => setShowError(false)}>
                                    <X className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">Помилка</h3>
                                <p className="text-sm text-slate-600">{errorMessage}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowError(false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Зрозуміло
                        </button>
                    </div>
                </div>
            )}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">Реєстрація успішна!</h3>
                                <p className="text-sm text-slate-600">Ваш обліковий запис успішно створено. Тепер ви можете увійти в систему.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setShowSuccess(false);
                                setShowRegisterModal(false);
                                setShowLoginModal(true);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Увійти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUpModal;