import { useEffect, useState } from "react";
import { X, Search, ChevronLeft, Calendar, FileText } from "lucide-react";
import {addFullVisit, generateVisitRecord} from "../../visits/api/visitPageService.ts";
import {getAutorepairCarSpecialization, getAutorepairServicesById} from "../api/autorepairPageService.ts"
import {carDataJson} from '../../utils/data/carData.ts'
import {useAuth} from "../../components/auth/AuthContext.tsx";
import {getAllCarsByClientId, getClientInfoByClientId} from "../../client-main/api/clientMainApi.ts";
import Swal from "sweetalert2";
import AsyncCreatableSelect from "react-select/async-creatable";

interface UserCar {
    car_id: number;
    brand: string;
    model: string;
    engine_type: string;
    year: string;
    license_plate: string;
    vin: string;
}

// Booking Modal Component
const BookingModal = ({ autorepairName, autorepairId, onClose }: { autorepairName: string; autorepairId: number; onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState<'select' | 'describe' | null>(null);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
    const [services, setServices] = useState<{autorepair_service_id: number, name: string}[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [carData, setCarData] = useState({
        brand: '',
        model: '',
        engineType: '',
        year: '',
        licensePlate: '',
        vin: ''
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('09:00');
    const [alternativeDate, setAlternativeDate] = useState<Date | null>(null);
    const [alternativeTime, setAlternativeTime] = useState('09:00');
    const [showAlternativeDate, setShowAlternativeDate] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [personalData, setPersonalData] = useState({
        email: '',
        name: '',
        phone: ''
    });
    const [problemDescription, setProblemDescription] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [additionalNote, setAdditionalNote] = useState('');
    const [showNoteInput, setShowNoteInput] = useState(false);

    const { user } = useAuth();
    const [userCars, setUserCars] = useState<UserCar[]>([]);
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

    const [isUrgent, setIsUrgent] = useState(false);

    //for car information inputting
    const [inputCarValue, setInputCarValue] = useState('');
    const [inputCarModel, setInputCarModel] = useState('');
    const [inputCarEngine, setInputCarEngine] = useState('');
    const [inputCarYear, setInputCarYear] = useState('');





    const [carOptions, setCarOptions] = useState({
        brands: [] as string[],
        models: [] as string[],
        engineTypes: [] as string[],
        years: [] as number[],
    });


    useEffect( () => {
        const fetchUserCarsData = async () => {
            if (user?.id) {
                try {
                    const result = await getAllCarsByClientId(user?.id);
                    setUserCars(result.data)
                }
                catch (error) {

                }
            }
        }

        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const result = await getClientInfoByClientId(user?.id);
                    console.log(result)
                    setPersonalData({
                        email : result.data.client.email ?? "",
                        name : result.data.client.name ?? "",
                        phone : result.data.client.phone ?? ""
                    })
                }
                catch (error) {}
            }
        }

        fetchUserData()
        fetchUserCarsData()
    }, [user] )

    useEffect(() => {
        console.log(`use effect ${autorepairId}`)
        const fetchServices = async () => {
            if (autorepairId) {
                try {
                    const servicesData = await getAutorepairServicesById(autorepairId);
                    setServices(servicesData);
                } catch (error) {
                    console.error('Error fetching services:', error);
                }
            }
        };


        const fetchCarSpecialization = async () => {
            try {
                if (autorepairId) {
                    const result = await getAutorepairCarSpecialization(autorepairId)
                    console.log(result.data)
                    setCarOptions(result.data)
                }
            }
            catch (err) {
                    console.error('Error fetching services:', error);

            }
        }

        fetchServices();
        fetchCarSpecialization();
    }, [autorepairId]);

    const totalSteps = 6;

    // Functions for calendar navigation
    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Generate days for current month
    const generateCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start
        const daysInMonth = lastDay.getDate();

        const days = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const handleServiceToggle = (serviceId: number) => {
        setSelectedServiceIds(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
    };

    const handleAltDateSelect = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setAlternativeDate(newDate);
    };

    const handleNext = async() => {
        if (step + 1 < totalSteps) {
            setStep(step + 1);
        } else {
            if (bookingType === 'select' && selectedServiceIds.length === 0) {
                setErrorMessage('Будь ласка, оберіть хоча б одну послугу');
                setShowError(true);
                return;
            }

            if (bookingType === 'describe' && !problemDescription.trim()) {
                setErrorMessage('Будь ласка, опишіть проблему');
                setShowError(true);
                return;
            }
            let finalDate = null;
            if (selectedDate && selectedTime) {
                const [hours, minutes] = selectedTime.split(':').map(Number);
                finalDate = new Date(selectedDate);
                finalDate.setHours(hours, minutes, 0, 0);
            }

            let finalAltDate = null;
            if (alternativeDate && alternativeTime) {
                const [hours, minutes] = alternativeTime.split(':').map(Number);
                finalAltDate = new Date(alternativeDate);
                finalAltDate.setHours(hours, minutes, 0, 0);
            }
            console.log("SUBMIT")
            console.log(carData)

            let visitId, clientId, carId;

            if(bookingType === 'select') {

                try {

                    console.log('Booking submitted:', {
                        car_brand: carData.brand,
                        car_model: carData.model,
                        car_engineType: carData.engineType || undefined,
                        car_year: carData.year ? Number(carData.year) : undefined,
                        car_licensePlate: carData.licensePlate,
                        car_vin: carData.vin,

                        client_name: personalData.name,
                        client_surname: undefined,
                        client_middlename: undefined,
                        client_email: personalData.email,
                        client_phone: personalData.phone,

                        visit_selectedDate: finalDate ? finalDate.toISOString() : null,
                        visit_selectedAlternativeDate: finalAltDate ? finalAltDate.toISOString() : null,
                        visit_note: additionalNote || null,
                        visit_paymentWay: null,
                        visit_paymentStatus: null,
                        visit_isCompleted: null,
                        visit_carid: null,

                        is_urgent: isUrgent || null,

                        visit_autorepairId: String(autorepairId),

                        visit_selectedServices: selectedServiceIds ?? []
                    });

                    ({ visitId, clientId, carId } = await addFullVisit({
                        car_brand: carData.brand,
                        car_model: carData.model,
                        car_engineType: carData.engineType || undefined,
                        car_year: carData.year ? Number(carData.year) : undefined,
                        car_licensePlate: carData.licensePlate,
                        car_vin: carData.vin,

                        client_name: personalData.name,
                        client_surname: undefined,
                        client_middlename: undefined,
                        client_email: personalData.email,
                        client_phone: personalData.phone,

                        visit_selectedDate: finalDate ? finalDate.toISOString() : null,
                        visit_selectedAlternativeDate: finalAltDate ? finalAltDate.toISOString() : null,
                        visit_note: additionalNote || null,
                        visit_paymentWay: null,
                        visit_paymentStatus: null,
                        visit_isCompleted: null,
                        visit_carid: null,

                        is_urgent: isUrgent || null,

                        visit_autorepairId: String(autorepairId),

                        visit_selectedServices: selectedServiceIds ?? []
                    }));

                    setStep(step + 1);
                }
                catch (error) {
                    setErrorMessage(error?.message);
                    setShowError(true);
                }
            }
            else {
                try {

                    console.log('Booking submitted:', {
                        car_brand: carData.brand,
                        car_model: carData.model,
                        car_engineType: carData.engineType || undefined,
                        car_year: carData.year ? Number(carData.year) : undefined,
                        car_licensePlate: carData.licensePlate,
                        car_vin: carData.vin,

                        client_name: personalData.name,
                        client_surname: undefined,
                        client_middlename: undefined,
                        client_email: personalData.email,
                        client_phone: personalData.phone,

                        visit_selectedDate: finalDate ? finalDate.toISOString() : null,
                        visit_selectedAlternativeDate: finalAltDate ? finalAltDate.toISOString() : null,
                        visit_note: additionalNote || null,
                        visit_paymentWay: null,
                        visit_paymentStatus: null,
                        visit_isCompleted: null,
                        visit_carid: null,

                        is_urgent: isUrgent || null,

                        visit_autorepairId: String(autorepairId),

                        visit_selectedServices: problemDescription
                    });


                    ({ visitId, clientId, carId } = await addFullVisit({
                        car_brand: carData.brand,
                        car_model: carData.model,
                        car_engineType: carData.engineType || undefined,
                        car_year: carData.year ? Number(carData.year) : undefined,
                        car_licensePlate: carData.licensePlate,
                        car_vin: carData.vin,

                        client_name: personalData.name,
                        client_surname: undefined,
                        client_middlename: undefined,
                        client_email: personalData.email,
                        client_phone: personalData.phone,

                        visit_selectedDate: finalDate ? finalDate.toISOString() : null,
                        visit_selectedAlternativeDate: finalAltDate ? finalAltDate.toISOString() : null,
                        visit_note: additionalNote || null,
                        visit_paymentWay: null,
                        visit_paymentStatus: null,
                        visit_isCompleted: null,
                        visit_carid: null,

                        is_urgent: isUrgent || null,

                        visit_autorepairId: String(autorepairId),

                        visit_selectedServices: problemDescription
                    }));

                    setStep(step + 1);
                }
                catch (error) {
                    setErrorMessage(error?.message);
                    setShowError(true);
                }
            }
            const pdfBlob = await generateVisitRecord({ visitId, clientId, carId });

            const pdfUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));

            Swal.fire({
                title: "<strong style='font-size:28px;color:#1e293b'>Запис успішно створено!</strong>",
                html: `
        <div style="font-size:18px;color:#475569;margin-bottom:20px;">
            Ваш PDF-файл готовий до завантаження
        </div>

        <a href="${pdfUrl}"
           download="visit-confirmation.pdf"
           style="
               display:inline-block;
               margin-bottom:25px;
               padding:14px 26px;
               background:#2563eb;
               color:white;
               border-radius:8px;
               font-size:18px;
               font-weight:600;
               text-decoration:none;
           ">
           ⬇️ Завантажити PDF
        </a>

        <div style="border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">
            <iframe src="${pdfUrl}"
                    style="width:100%;height:420px;border:0;">
            </iframe>
        </div>
    `,
                width: 800,
                padding: "20px",
                showConfirmButton: true,
                confirmButtonText: "Гаразд",
                confirmButtonColor: "#2563eb",
                background: "#f8fafc",
            });
            //onClose();

        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Filter services based on search query
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get month name in Ukrainian
    const getMonthName = (month: number) => {
        const months = [
            'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
            'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
        ];
        return months[month];
    };

    const calendarDays = generateCalendarDays();


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                                disabled={step === 6}
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600" />
                            </button>
                        )}
                        <h3 className="text-lg font-semibold text-slate-800">
                            СТО "{autorepairName}"
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex gap-1">
                        {[...Array(totalSteps)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                    i < step ? 'bg-blue-600' : 'bg-slate-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Choose booking type */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                <span className="text-blue-600">Вітаємо!</span> Що потрібно вашому автомобілю?
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Якщо ви не впевнені, які саме послуги вам потрібні, виберіть варіант з опису проблеми.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setBookingType('select');
                                        handleNext();
                                    }}
                                    className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                                >
                                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Search className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <p className="font-medium text-slate-800">Вибрати послугу</p>
                                </button>
                                <button
                                    onClick={() => {
                                        setBookingType('describe');
                                        handleNext();
                                    }}
                                    className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                                >
                                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <p className="font-medium text-slate-800">Опишіть проблему</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select services */}
                    {step === 2 && bookingType === 'select' && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Що потрібно вашому автомобілю?
                            </h2>

                            <div className="mb-6">
                                <p className="text-sm font-medium text-slate-600 mb-3">Пошук необхідних послуг</p>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Пошук"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-600 mb-3">Рекомендовані послуги майстерні</p>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {filteredServices.map((service) => (
                                        <label
                                            key={service.autorepair_service_id}
                                            className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedServiceIds.includes(service.autorepair_service_id)}
                                                onChange={() => handleServiceToggle(service.autorepair_service_id)}
                                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-slate-700">{service.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Step 2: Describe problem */}
                    {step === 2 && bookingType === 'describe' && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Опишіть проблему вашого автомобіля
                            </h2>

                            <div className="mb-6">
                                <p className="text-sm font-medium text-slate-600 mb-3">
                                    Детально опишіть проблему або симптоми
                                </p>
                                <textarea
                                    rows={6}
                                    placeholder="Наприклад: Автомобіль видає незвичайний шум при гальмуванні, горить індикатор двигуна, проблеми з запуском у холодну погоду тощо..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    value={problemDescription}
                                    onChange={(e) => setProblemDescription(e.target.value)}
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Чим детальніше ви опишете проблему, тим краще майстер зможе підготуватися до вашого візиту
                                </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FileText className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-800 mb-1">Порада</p>
                                        <p className="text-xs text-blue-700">
                                            Вкажіть марку та модель авто, тип двигуна, рік випуску, а також коли вперше помітили проблему.
                                            Це допоможе майстру швидше визначити можливі причини.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Car information */}
                    {step === 3 && (
                        user && Array.isArray(userCars) ? (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                Виберіть автомобіль
                            </h2>
                            <p className="text-sm text-slate-600 mb-6">
                                Оберіть один із ваших збережених автомобілів
                            </p>

                            <div className="space-y-3 mb-4">
                                {userCars.map((car, index) => (
                                    <label
                                        key={car.car_id || index}
                                        className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="selectedCar"
                                            value={car.car_id || index}
                                            checked={selectedCarId === (car.car_id || index)}
                                            onChange={(e) => {
                                                const carId = Number(e.target.value);
                                                setSelectedCarId(carId)
                                                const selectedCar = userCars.find(userCar => userCar.car_id === carId);
                                                console.log(selectedCar)
                                                if (selectedCar) {
                                                    setCarData({
                                                        brand: selectedCar.brand,
                                                        year: selectedCar.year,
                                                        vin: selectedCar.vin,
                                                        model: selectedCar.model,
                                                        engineType: selectedCar.engine_type,
                                                        licensePlate: selectedCar.license_plate
                                                    })
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <p className="font-medium text-slate-800">
                                                {car.brand} {car.model}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {car.year} • {car.engine_type}<br/>
                                                {car.license_plate} • {car.vin}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                         ) : (
                                 <div>
                                     <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                         Яким автомобілем Ви керуєте?
                                     </h2>
                                     <p className="text-sm text-slate-600 mb-6">
                                         У вас є акаунт? Увійдіть, і дані про ваш автомобіль будуть заповнені автоматично.
                                     </p>

                                     <div className="space-y-4">
                                         <p className="font-medium text-slate-700">Заповніть дані автомобіля</p>

                                         <div>
                                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                                 Марка <span className="text-red-500">*</span>
                                             </label>
                                             {/*<select*/}
                                             {/*    value={carData.brand}*/}
                                             {/*    onChange={(e) => setCarData({*/}
                                             {/*        ...carData,*/}
                                             {/*        brand: e.target.value,*/}
                                             {/*        model: '',*/}
                                             {/*        engineType: '',*/}
                                             {/*        year: ''*/}
                                             {/*    })}*/}
                                             {/*    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
                                             {/*>*/}
                                             {/*    <option value="">Виберіть</option>*/}
                                             {/*    {[...new Set(carDataJson.map(item => item.brand))].map(brand => (*/}
                                             {/*        <option key={brand} value={brand}>*/}
                                             {/*            {brand.charAt(0).toUpperCase() + brand.slice(1)}*/}
                                             {/*        </option>*/}
                                             {/*    ))}*/}
                                             {/*</select>*/}

                                             <AsyncCreatableSelect
                                                 inputValue={inputCarValue}

                                                 onInputChange={(val, meta) => {
                                                     if (meta.action === 'input-change') {
                                                         setInputCarValue(val);
                                                     }
                                                 }}


                                                 value={carData.brand ? { label: carData.brand, value: carData.brand } : null}

                                                 className="w-full px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                 loadOptions={async (input) => {
                                                     const result = await getAutorepairCarSpecialization(autorepairId);
                                                     return result.data.brands
                                                         .filter(b => b.toLowerCase().includes(input.toLowerCase()))
                                                         .map(b => ({ label: b, value: b }));
                                                 }}
                                                 formatCreateLabel={() => null}
                                                 isValidNewOption={() => false}
                                                 onChange={(opt) => {
                                                     setCarData({
                                                         ...carData,
                                                         brand: opt?.value || '',
                                                         model: '',
                                                         engineType: '',
                                                         year: '',
                                                     });

                                                     setInputCarValue('');
                                                    }
                                                 }

                                                 onBlur={() => {
                                                     if (inputCarValue.trim()) {
                                                         setCarData({
                                                             ...carData,
                                                             brand: inputCarValue.trim() || '',
                                                             model: '',
                                                             engineType: '',
                                                             year: '',
                                                         });
                                                     }
                                                 }}
                                             />



                                         </div>

                                         <div>
                                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                                 Модель <span className="text-red-500">*</span>
                                             </label>
                                             {/*<select*/}
                                             {/*    value={carData.model}*/}
                                             {/*    onChange={(e) => setCarData({*/}
                                             {/*        ...carData,*/}
                                             {/*        model: e.target.value,*/}
                                             {/*        engineType: '',*/}
                                             {/*        year: ''*/}
                                             {/*    })}*/}
                                             {/*    disabled={!carData.brand}*/}
                                             {/*    className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${*/}
                                             {/*        !carData.brand ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''*/}
                                             {/*    }`}*/}
                                             {/*>*/}
                                             {/*    <option value="">Виберіть</option>*/}
                                             {/*    {[...new Set(carDataJson*/}
                                             {/*        .filter(item => item.brand === carData.brand)*/}
                                             {/*        .map(item => item.model)*/}
                                             {/*    )].map(model => (*/}
                                             {/*        <option key={model} value={model}>*/}
                                             {/*            {model.charAt(0).toUpperCase() + model.slice(1)}*/}
                                             {/*        </option>*/}
                                             {/*    ))}*/}
                                             {/*</select>*/}

                                             <AsyncCreatableSelect
                                                 inputValue={inputCarModel}

                                                 onInputChange={(val, meta) => {
                                                     if (meta.action === 'input-change') {
                                                         setInputCarModel(val);
                                                     }
                                                 }}


                                                 value={carData.model ? { label: carData.model, value: carData.model } : null}

                                                 className={`w-full px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                 loadOptions={async (input) => {
                                                     const result = await getAutorepairCarSpecialization(autorepairId, {brand:carData.brand});

                                                     console.log(result)

                                                     return result.data.models
                                                         .filter(b => b.toLowerCase().includes(input.toLowerCase()))
                                                         .map(b => ({ label: b, value: b }));
                                                 }}
                                                 formatCreateLabel={() => null}
                                                 isValidNewOption={() => false}
                                                 onChange={(opt) => {
                                                     setCarData({
                                                         ...carData,
                                                         model: opt?.value || '',
                                                         engineType: '',
                                                         year: '',
                                                     });

                                                     setInputCarModel('');
                                                 }
                                                 }

                                                 isDisabled={!carData.brand}

                                                 onBlur={() => {
                                                     if (inputCarModel.trim()) {
                                                         setCarData({
                                                             ...carData,
                                                             model: inputCarModel.trim() || '',
                                                             engineType: '',
                                                             year: '',
                                                         });
                                                     }
                                                 }}
                                             />

                                             {!carData.brand && (
                                                 <p className="text-xs text-slate-500 mt-1">Спочатку оберіть марку</p>
                                             )}
                                         </div>

                                         <div>
                                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                                 Тип двигуна <span className="text-red-500">*</span>
                                             </label>
                                             {/*<select*/}
                                             {/*    value={carData.engineType}*/}
                                             {/*    onChange={(e) => setCarData({*/}
                                             {/*        ...carData,*/}
                                             {/*        engineType: e.target.value,*/}
                                             {/*        year: ''*/}
                                             {/*    })}*/}
                                             {/*    disabled={!carData.model}*/}
                                             {/*    className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${*/}
                                             {/*        !carData.model ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''*/}
                                             {/*    }`}*/}
                                             {/*>*/}
                                             {/*    <option value="">Виберіть</option>*/}
                                             {/*    {[...new Set(carDataJson*/}
                                             {/*        .filter(item => item.brand === carData.brand && item.model === carData.model)*/}
                                             {/*        .map(item => item.engineType)*/}
                                             {/*    )].map(engineType => (*/}
                                             {/*        <option key={engineType} value={engineType}>*/}
                                             {/*            {engineType === 'petrol' ? 'Бензин' :*/}
                                             {/*                engineType === 'diesel' ? 'Дизель' :*/}
                                             {/*                    engineType === 'hybrid' ? 'Гібрид' :*/}
                                             {/*                        engineType === 'electric' ? 'Електро' : engineType}*/}
                                             {/*        </option>*/}
                                             {/*    ))}*/}
                                             {/*</select>*/}

                                             <AsyncCreatableSelect
                                                 inputValue={inputCarEngine}

                                                 onInputChange={(val, meta) => {
                                                     if (meta.action === 'input-change') {
                                                         setInputCarEngine(val);
                                                     }
                                                 }}


                                                 value={carData.engineType ? { label: carData.engineType, value: carData.engineType } : null}

                                                 className={`w-full px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                 loadOptions={async (input) => {
                                                     const result = await getAutorepairCarSpecialization(autorepairId, {brand:carData.brand, model: carData.model});

                                                     console.log(result)

                                                     return result.data.engineTypes
                                                         .filter(b => b.toLowerCase().includes(input.toLowerCase()))
                                                         .map(b => ({ label: b, value: b }));
                                                 }}
                                                 formatCreateLabel={() => null}
                                                 isValidNewOption={() => false}
                                                 onChange={(opt) => {
                                                     setCarData({
                                                         ...carData,
                                                         engineType: opt?.value ||'',
                                                         year: '',
                                                     });

                                                     setInputCarEngine('');
                                                 }
                                                 }

                                                 isDisabled={!carData.model}

                                                 onBlur={() => {
                                                     if (inputCarEngine.trim()) {
                                                         setCarData({
                                                             ...carData,
                                                             engineType: inputCarEngine.trim() || '',
                                                             year: '',
                                                         });
                                                     }
                                                 }}
                                             />

                                             {!carData.model && (
                                                 <p className="text-xs text-slate-500 mt-1">Спочатку оберіть модель</p>
                                             )}
                                         </div>

                                         <div>
                                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                                 Рік виробництва <span className="text-red-500">*</span>
                                             </label>
                                             {/*<select*/}
                                             {/*    value={carData.year}*/}
                                             {/*    onChange={(e) => setCarData({ ...carData, year: e.target.value })}*/}
                                             {/*    disabled={!carData.engineType}*/}
                                             {/*    className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${*/}
                                             {/*        !carData.engineType ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''*/}
                                             {/*    }`}*/}
                                             {/*>*/}
                                             {/*    <option value="">Виберіть</option>*/}
                                             {/*    {[...new Set(carDataJson*/}
                                             {/*        .filter(item =>*/}
                                             {/*            item.brand === carData.brand &&*/}
                                             {/*            item.model === carData.model &&*/}
                                             {/*            item.engineType === carData.engineType*/}
                                             {/*        )*/}
                                             {/*        .map(item => item.year)*/}
                                             {/*    )].sort((a, b) => b - a).map(year => (*/}
                                             {/*        <option key={year} value={year}>{year}</option>*/}
                                             {/*    ))}*/}
                                             {/*</select>*/}

                                             <AsyncCreatableSelect
                                                 inputValue={inputCarYear}
                                                 key={`year-select-${carData.brand}-${carData.model}-${carData.engineType}`}


                                                 onInputChange={(val, meta) => {
                                                     if (meta.action === 'input-change') {
                                                         setInputCarYear(val);
                                                     }
                                                 }}

                                                 value={carData.year ? { label: String(carData.year), value: String(carData.year) } : null}

                                                 className={`w-full px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                 loadOptions={async (input) => {
                                                     const result = await getAutorepairCarSpecialization
                                                     (autorepairId,
                                                         {brand:carData.brand, model: carData.model, engineType: carData.engineType});

                                                     console.log(result)

                                                     return result.data.years
                                                         .filter(y => String(y).includes(input))
                                                         .map(y => ({
                                                             label: String(y),
                                                             value: String(y)
                                                         }));
                                                 }}
                                                 formatCreateLabel={() => null}
                                                 isValidNewOption={() => false}
                                                 onChange={(opt) => {
                                                     setCarData({
                                                         ...carData,
                                                         year: opt?.value ||''
                                                     });

                                                     setInputCarYear('');
                                                 }
                                                 }

                                                 isDisabled={!carData.engineType}

                                                 onBlur={() => {
                                                     if (inputCarYear.trim()) {
                                                         setCarData({
                                                             ...carData,
                                                             year: inputCarYear.trim() || ''
                                                         });
                                                         setInputCarYear('');
                                                     }
                                                 }}
                                             />

                                             {!carData.engineType && (
                                                 <p className="text-xs text-slate-500 mt-1">Спочатку оберіть тип двигуна</p>
                                             )}
                                         </div>

                                         <div>
                                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                                 Номерний знак
                                             </label>
                                             <input
                                                 type="text"
                                                 value={carData.licensePlate}
                                                 onChange={(e) => setCarData({ ...carData, licensePlate: e.target.value })}
                                                 className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                             />
                                         </div>

                                         <div>
                                             <label className="block text-sm font-medium text-slate-700 mb-2">VIN</label>
                                             <input
                                                 type="text"
                                                 value={carData.vin}
                                                 onChange={(e) => setCarData({ ...carData, vin: e.target.value })}
                                                 className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                             />
                                             <p className="text-xs text-slate-500 mt-1">
                                                 VIN-номер можна знайти в реєстраційному свідоцтві або конці транспортного засобу
                                             </p>
                                         </div>
                                     </div>
                                 </div>



                    ))}

                    {/* Step 4: Date selection */}
                    {step === 4 && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Коли ви можете залишити свій автомобіль?
                            </h2>

                            <div className="mb-6">
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => {
                                            setIsUrgent(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${
                                            !isUrgent
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        Запропонуйте дату
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsUrgent(true);
                                            setSelectedDate(null);
                                            setAlternativeDate(null);
                                            setShowAlternativeDate(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${
                                            isUrgent
                                                ? "bg-red-600 text-white"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        Якнайшвидше
                                    </button>
                                </div>

                                {/* Main Date Selection */}
                                <div className="border border-slate-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            onClick={prevMonth}
                                            className="p-1 hover:bg-slate-100 rounded"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="font-medium">
                                            {getMonthName(currentMonth)} {currentYear}
                                        </span>
                                        <button
                                            onClick={nextMonth}
                                            className="p-1 hover:bg-slate-100 rounded"
                                        >
                                            <ChevronLeft className="w-5 h-5 rotate-180" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
                                            <div key={day} className="font-medium text-slate-600 py-2">{day}</div>
                                        ))}
                                        {calendarDays.map((day, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    if (!day || isUrgent) return;
                                                    if (!showAlternativeDate) {
                                                        handleDateSelect(day);
                                                    } else {
                                                        handleAltDateSelect(day);
                                                    }
                                                }}
                                                disabled={!day}
                                                className={`py-2 rounded-lg transition-colors ${
                                                    day && selectedDate &&
                                                    selectedDate.getDate() === day &&
                                                    selectedDate.getMonth() === currentMonth &&
                                                    selectedDate.getFullYear() === currentYear
                                                        ? 'bg-blue-600 text-white font-medium'
                                                        : day && alternativeDate &&
                                                        alternativeDate.getDate() === day &&
                                                        alternativeDate.getMonth() === currentMonth &&
                                                        alternativeDate.getFullYear() === currentYear
                                                            ? 'bg-green-500 text-white font-medium'
                                                            : day
                                                                ? 'hover:bg-slate-100 text-slate-700'
                                                                : 'text-slate-300'
                                                }`}
                                            >
                                                {day || ''}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Date Selection */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg flex-1">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700">
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('uk-UA')
                                                : 'Оберіть дату'
                                            }
                                        </span>
                                    </div>
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="px-4 py-2.5 border border-slate-300 rounded-lg flex-1"
                                    >
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="11:00">11:00</option>
                                        <option value="12:00">12:00</option>
                                        <option value="13:00">13:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                        <option value="17:00">17:00</option>
                                    </select>
                                </div>

                                {/* Alternative Date Button/Section */}
                                {selectedDate && !showAlternativeDate && (
                                    <button
                                        onClick={() => setShowAlternativeDate(true)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-blue-600 font-medium"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Додати альтернативну дату
                                    </button>
                                )}

                                {/* Alternative Date Selection */}
                                {showAlternativeDate && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-slate-700">
                                                Альтернативна дата
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setShowAlternativeDate(false);
                                                    setAlternativeDate(null);
                                                    setAlternativeTime('09:00');
                                                }}
                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg flex-1 bg-white">
                                                <Calendar className="w-5 h-5 text-slate-400" />
                                                <span className="text-slate-700 text-sm">
                                                    {alternativeDate
                                                        ? alternativeDate.toLocaleDateString('uk-UA')
                                                        : 'Оберіть дату з календаря вище'
                                                    }
                                                </span>
                                            </div>
                                            <select
                                                value={alternativeTime}
                                                onChange={(e) => setAlternativeTime(e.target.value)}
                                                className="px-4 py-2.5 border border-slate-300 rounded-lg flex-1 bg-white text-sm"
                                            >
                                                <option value="09:00">09:00</option>
                                                <option value="10:00">10:00</option>
                                                <option value="11:00">11:00</option>
                                                <option value="12:00">12:00</option>
                                                <option value="13:00">13:00</option>
                                                <option value="14:00">14:00</option>
                                                <option value="15:00">15:00</option>
                                                <option value="16:00">16:00</option>
                                                <option value="17:00">17:00</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Personal information */}
                    {step === 5 && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                Ви майже закінчили
                            </h2>
                            <p className="text-sm text-slate-600 mb-6">
                                Бажаєте поділитися чимось ще з майстернею, що ви вважаєте важливим для надання послуг?
                            </p>

                            {/* Add/Delete Note Button */}
                            {!showNoteInput ? (
                                <button
                                    onClick={() => setShowNoteInput(true)}
                                    className="flex items-center gap-2 px-4 py-2 mb-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-600"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm font-medium">Додати примітку</span>
                                </button>
                            ) : (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Примітка для майстерні
                                        </label>
                                        <button
                                            onClick={() => {
                                                setShowNoteInput(false);
                                                setAdditionalNote('');
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Видалити примітку
                                        </button>
                                    </div>
                                    <textarea
                                        rows={4}
                                        placeholder="Наприклад: Прошу зателефонувати за годину до прибуття, потрібна допомога з паркуванням..."
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        value={additionalNote}
                                        onChange={(e) => setAdditionalNote(e.target.value)}
                                        maxLength={800}
                                    />
                                    <p className="text-xs text-slate-500 mt-1 text-right">
                                        Залишилось символів: {800 - additionalNote.length}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <p className="font-medium text-slate-700">Заповніть персональні дані</p>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        E-mail <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        disabled={!!user?.id}
                                        value={personalData.email}
                                        onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Ім'я <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!!user?.id}
                                        value={personalData.name}
                                        onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Телефонний номер <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            disabled={!!user?.id}
                                            value={personalData.phone}
                                            onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                                            className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Step 6: Confirmation */}
                    {step === 6 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Запис створено!</h2>
                            {/*<p className="text-slate-600">*/}
                            {/*    Ми надіслали підтвердження на вашу електронну пошту.*/}
                            {/*</p>*/}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                {
                    step < 6 && (
                        <div className="p-6 border-t">
                            <button
                                onClick={handleNext}
                                disabled={
                                    step === 1 ||
                                    (step === 2 && bookingType === 'select' && selectedServiceIds.length === 0) ||
                                    (step === 2 && bookingType === 'describe' && !problemDescription.trim()) ||
                                    (step === 4 && !selectedDate && !isUrgent)
                                }
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                ДАЛІ
                            </button>
                        </div>
                    )}
            </div>
            {/* Error Modal */}
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
        </div>
    );
};

export default BookingModal;