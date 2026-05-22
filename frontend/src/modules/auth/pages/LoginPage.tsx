import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import {LoginUser} from "../api/AuthApi.ts";
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2'
import {useAuth} from "../../components/auth/AuthContext.tsx";

const LoginModal = ({
                        setShowRegisterModal}:
                    {setShowRegisterModal: (value: boolean) => void}) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setShowLoginModal, getUser } = useAuth();

    const handleSubmit = async () => {
        try {
           const result = await LoginUser({login, password});
           if(result.data.message == 'ok') {
               await getUser();
               setShowLoginModal(false);
               navigate('/client-main')
           }
        }
        catch (error) {
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Щось пішло не так спробуйте ще раз"

            Swal.fire({
                icon: "error",
                title: "Помилка",
                text: msg,
            });
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
                {/* Close button */}
                <button
                    onClick={() => {
                        setShowLoginModal(false);
                        setShowRegisterModal(false);
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X size={24} onClick={() => setShowLoginModal(false)} />
                </button>

                {/* Modal content */}
                <div className="p-8">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center mb-8">Вітаємо знову!</h2>

                    {/* Social login buttons */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 mb-3 hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="font-medium">Увійти за допомогою Facebook</span>
                    </button>

                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 mb-6 hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium">Увійти за допомогою Google</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-500 text-sm">або</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Login form */}
                    <div>
                        {/* Email field */}
                        <div className="mb-4">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                        <span className="text-gray-600">Немає облікового запису?</span>{' '}
                        <button
                            onClick={() => {
                                setShowLoginModal(false);
                                setShowRegisterModal(true);
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            Зареєструйтесь тут
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;