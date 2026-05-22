import React, { useState } from 'react';
import { ChevronDown, Calendar, Info, X } from 'lucide-react';
import Swal from 'sweetalert2';
import {addCarByClientId, getCarSpecializations} from "../api/clientMainApi.ts";
import {useAuth} from "../../components/auth/AuthContext.tsx";
import AsyncCreatableSelect from 'react-select/async-creatable';

export const AddCarForm = ({setShowForm}:{setShowForm: (v:boolean)=>void}) => {
    const [carData, setCarData] = useState({
        brand: '',
        model: '',
        engineType: '',
        year: '',
        insuranceExpiry: '',
        licensePlate: '',
        vin: ''
    });

    const [inputs, setInputs] = useState({ brand: '', model: '', engine: '', year: '' });

    const { user } = useAuth()
    const [isFormValid, setIsFormValid] = useState(false);

    const loadOptions = async (type: 'brand' | 'model' | 'engine' | 'year', inputValue: string) => {
        const filters = {
            brand: carData.brand,
            model: carData.model,
            engine_type: carData.engineType
        };
        const data = await getCarSpecializations(filters);

        let targetArray: string[] = [];
        if (type === 'brand') targetArray = data.brands as string[];
        if (type === 'model') targetArray = data.models as string[];
        if (type === 'engine') targetArray = data.engineTypes as string[];
        if (type === 'year') targetArray = data.years.map(String);

        return targetArray
            .filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
            .map(item => ({ label: item, value: item }));
    };

    const handleInputChange = (field: string, value: string) => {
        const newFormData = { ...carData, [field]: value };
        setCarData(newFormData);

        // Check if required fields are filled
        const requiredFilled = newFormData.licensePlate && newFormData.vin
            // newFormData.brand && newFormData.model &&
            // newFormData.engineType && newFormData.year && ;
        setIsFormValid(!!requiredFilled);
    };

    const handleClose = () => {
        Swal.fire({
            title: 'Закрити форму?',
            text: 'Всі незбережені дані будуть втрачені',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Так, закрити',
            cancelButtonText: 'Скасувати'
        }).then((result) => {
            if(result.isConfirmed)
            setShowForm(false);
        });
    };

    const handleSubmit = () => {
        if (!isFormValid) {
            Swal.fire({
                title: 'Помилка!',
                text: 'Будь ласка, заповніть всі обов\'язкові поля',
                icon: 'error',
                confirmButtonColor: '#f97316',
                confirmButtonText: 'Зрозуміло'
            });
            return;
        }

        Swal.fire({
            title: 'Зберегти автомобіль?',
            html: `
        <div class="text-left space-y-2">
          <p><strong>Марка:</strong> ${carData.brand}</p>
          <p><strong>Модель:</strong> ${carData.model}</p>
          <p><strong>Тип двигуна:</strong> ${carData.engineType}</p>
          <p><strong>Рік:</strong> ${carData.year}</p>
          ${carData.licensePlate ? `<p><strong>Номер:</strong> ${carData.licensePlate}</p>` : ''}
          ${carData.vin ? `<p><strong>VIN:</strong> ${carData.vin}</p>` : ''}
        </div>
      `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Зберегти',
            cancelButtonText: 'Скасувати'
        }).then(async(result) => {
            if (result.isConfirmed && user.id) {
                try {
                    console.log(setCarData)
                    await addCarByClientId(
                        {
                            ...carData,
                            year: Number(carData.year)
                        },
                        user.id
                    );

                    Swal.fire({
                        title: 'Збережено!',
                        text: 'Автомобіль успішно додано',
                        icon: 'success',
                        confirmButtonColor: '#f97316',
                        timer: 2000
                    }).then(() => {
                        // Reset form
                        setCarData({
                            brand: '',
                            model: '',
                            engineType: '',
                            year: '',
                            insuranceExpiry: '',
                            licensePlate: '',
                            vin: ''
                        });
                        setIsFormValid(false);
                    });
                }
                catch (error) {
                    await Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response?.data?.message,
                    })
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
                    <h1 className="text-xl font-semibold text-gray-900">Додати новий автомобіль</h1>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Марка<span className="text-red-500">*</span>
                        </label>

                        <AsyncCreatableSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={(v) => loadOptions('brand', v)}
                            onChange={(opt) => setCarData({
                                ...carData, brand: opt?.value || '', model: '', engineType: '', year: ''
                            })}
                            placeholder="Оберіть марку"
                            className="react-select-container"
                        />

                        {/*<div className="relative">*/}
                        {/*    /!*<select*!/*/}
                        {/*    /!*    value={formData.brand}*!/*/}
                        {/*    /!*    onChange={(e) => handleInputChange('brand', e.target.value)}*!/*/}
                        {/*    /!*    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"*!/*/}
                        {/*    /!*>*!/*/}
                        {/*    /!*    <option value="">Виберіть</option>*!/*/}
                        {/*    /!*    {brands.map(brand => (*!/*/}
                        {/*    /!*        <option key={brand} value={brand}>{brand}</option>*!/*/}
                        {/*    /!*    ))}*!/*/}
                        {/*    /!*</select>*!/*/}

                        {/*    */}
                        {/*    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />*/}
                        {/*</div>*/}


                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Модель<span className="text-red-500">*</span>
                        </label>

                        <AsyncCreatableSelect
                            key={`model-${carData.brand}`} // Скидає селект при зміні марки
                            isDisabled={!carData.brand}
                            cacheOptions
                            defaultOptions
                            loadOptions={(v) => loadOptions('model', v)}
                            onChange={(opt) => setCarData({
                                ...carData, model: opt?.value || '', engineType: '', year: ''
                            })}
                            placeholder={carData.brand ? "Оберіть модель" : "Спочатку оберіть марку"}
                        />

                        {/*<div className="relative">*/}
                        {/*    <select*/}
                        {/*        value={carData.model}*/}
                        {/*        onChange={(e) => handleInputChange('model', e.target.value)}*/}
                        {/*        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"*/}
                        {/*    >*/}
                        {/*        <option value="">Виберіть</option>*/}
                        {/*        {models.map(model => (*/}
                        {/*            <option key={model} value={model}>{model}</option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />*/}
                        {/*</div>*/}
                    </div>

                    {/* Engine Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Тип двигуна<span className="text-red-500">*</span>
                        </label>



                        <AsyncCreatableSelect
                            key={`engine-${carData.model}`}
                            isDisabled={!carData.model}
                            cacheOptions
                            defaultOptions
                            loadOptions={(v) => loadOptions('engine', v)}
                            onChange={(opt) => setCarData({
                                ...carData, engineType: opt?.value || '', year: ''
                            })}
                            placeholder={carData.model ? "Оберіть двигун" : "Спочатку оберіть модель"}
                        />



                        {/*<div className="relative">*/}
                        {/*    <select*/}
                        {/*        value={carData.engineType}*/}
                        {/*        onChange={(e) => handleInputChange('engineType', e.target.value)}*/}
                        {/*        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"*/}
                        {/*    >*/}
                        {/*        <option value="">Виберіть</option>*/}
                        {/*        {engineTypes.map(type => (*/}
                        {/*            <option key={type} value={type}>{type}</option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />*/}
                        {/*</div>*/}
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Рік виробництва<span className="text-red-500">*</span>
                        </label>


                        <AsyncCreatableSelect
                            key={`year-${carData.engineType}`}
                            isDisabled={!carData.engineType}
                            cacheOptions
                            defaultOptions
                            loadOptions={(v) => loadOptions('year', v)}
                            onChange={(opt) => setCarData({ ...carData, year: opt?.value || '' })}
                            placeholder={carData.engineType ? "Оберіть рік" : "Спочатку оберіть тип двигуна"}
                        />


                        {/*<div className="relative">*/}
                        {/*    <select*/}
                        {/*        value={formData.year}*/}
                        {/*        onChange={(e) => handleInputChange('year', e.target.value)}*/}
                        {/*        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"*/}
                        {/*    >*/}
                        {/*        <option value="">Виберіть</option>*/}
                        {/*        {years.map(year => (*/}
                        {/*            <option key={year} value={year}>{year}</option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />*/}
                        {/*</div>*/}
                    </div>

                    {/* Date Fields */}
                    <div>
                        {/* Insurance Expiry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Страховка до
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={carData.insuranceExpiry}
                                    onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                                    placeholder="mm/dd/yyyy"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                {/*<Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" size={20} />*/}
                            </div>
                        </div>
                    </div>

                    {/* License Plate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Номерний знак<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={carData.licensePlate}
                            onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* VIN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            VIN<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={carData.vin}
                            onChange={(e) => handleInputChange('vin', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="flex items-start gap-2 mt-2">
                            <Info className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-gray-500">
                                VIN-номер можна знайти у свідоцтві про реєстрацію або в книжці автомобіля. Ви можете вписати тут VIN-номер лише один раз. Коли його буде збережено, ви не зможете його змінити.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
                            isFormValid
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        ЗБЕРЕГТИ
                    </button>
                </div>
            </div>
        </div>
    );
}


export default AddCarForm;