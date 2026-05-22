import { Menu, X, Wrench } from 'lucide-react';
import { useState } from 'react';

const HeaderMainPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg w-screen top-0 z-50 absolute left-0 right-0">
            <div className="max-w-none px-4 py-4 mx-auto">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center space-x-3 group cursor-pointer flex-shrink-0">
                        <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                            <Wrench className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white tracking-tight">
                                AutoRepair
                            </div>
                            <div className="text-xs text-blue-200">Ваш надійний партнер</div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2 flex-1 justify-end">
                        <a href="/" className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 font-medium">
                            Головна
                        </a>
                        <a href="/autorepairs" className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 font-medium">
                            Автомайстерні
                        </a>
                        <a href="/services" className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 font-medium">
                            Послуги
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 space-y-2">
                        <a href="/" className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all font-medium">
                            Головна
                        </a>
                        <a href="/autorepairs" className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all font-medium">
                            Автомайстерні
                        </a>
                        <a href="/services" className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all font-medium">
                            Послуги
                        </a>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default HeaderMainPage;