import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {generateAutorepairRecord, getAutorepairById} from "../api/autorepairPageService.ts";
import {MapPin, Phone, Mail, Users, Star, ChevronLeft} from "lucide-react";
import BookVisit from "../components/BookVisit.tsx";
import Swal from "sweetalert2";

export interface Autorepair {
    autorepair_id: number;
    name: string;
    description?: string;
    adress?: string;
    index?: string;
    workers_amount?: number;
    phone?: string;
    email?: string;
    ranking?: number;
    password: string;
}


const AutoRepairPage= () => {
    const {id} = useParams();
    const [autorepair, setAutorepair] = useState<Autorepair|null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setAutorepair(await getAutorepairById(id) as Autorepair);
            } catch (error) {
                console.error("Error fetching autorepair:", error);
            } finally {
                setLoading(false);
            }

        }

        fetchData();
    }, [id])


    const handleShowAutorepairReport = async(autorepair_id: number) => {
        try {
            const response = await generateAutorepairRecord(autorepair_id)



            const pdfUrl = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            Swal.fire({
                title: `
                <div style="font-size:28px; font-weight:700; color:#1e293b;">
                    PDF-звіт автомайстерні
                </div>
            `,
                html: `
                <div style="font-size:18px; color:#475569; margin-bottom:20px;">
                    Ваш файл готовий до перегляду та завантаження
                </div>

                <a href="${pdfUrl}" 
                   download="autorepair-report.pdf"
                   style="
                       display:inline-block;
                       margin-bottom:25px;
                       padding:14px 26px;
                       background:#2563eb;
                       color:white;
                       border-radius:8px;
                       font-size:18px;
                       text-decoration:none;
                       font-weight:600;
                   ">
                   ⬇️ Завантажити PDF
                </a>

                <div style="border:1px solid #cbd5e1; border-radius:10px; overflow:hidden;">
                    <iframe src="${pdfUrl}"
                        style="width:100%; height:500px; border:0;">
                    </iframe>
                </div>
            `,
                width: 900,
                padding: "20px",
                background: "#f8fafc",
                showConfirmButton: true,
                confirmButtonColor: "#2563eb",
                confirmButtonText: "Закрити",
            });
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Помилка",
                text: "Не вдалося отримати PDF-файл. Спробуйте пізніше.",
            });
        }
    }


    if (loading) return <div>Loading...</div>;
    if (!autorepair) return <div>Autorepair not found</div>;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!autorepair) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Not Found</h2>
                    <p className="text-slate-600">Auto repair shop not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="max-w-5xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {autorepair.name}
                        </h1>
                        {autorepair.ranking && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 mr-2" />
                                    <span className="text-white font-semibold text-lg">
                    {autorepair.ranking}
                  </span>
                                    <span className="text-blue-100 ml-1">/ 5.0</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {autorepair.description && (
                        <div className="px-8 py-6 border-b border-slate-200">
                            <p className="text-slate-700 leading-relaxed text-lg">
                                {autorepair.description}
                            </p>
                        </div>
                    )}

                    {/* Contact Information Grid */}
                    <div className="grid md:grid-cols-2 gap-6 p-8">
                        {/* Address */}
                        {autorepair.adress && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Адреса</h3>
                                    <p className="text-slate-600">{autorepair.adress}</p>
                                    {autorepair.index && (
                                        <p className="text-slate-500 text-sm mt-1">
                                            Індекс: {autorepair.index}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Phone */}
                        {autorepair.phone && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Номер телефону</h3>
                                    <a
                                        href={`tel:${autorepair.phone}`}
                                        className="text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        {autorepair.phone}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        {autorepair.email && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                                    <a
                                        href={`mailto:${autorepair.email}`}
                                        className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                                    >
                                        {autorepair.email}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Workers */}
                        {autorepair.workers_amount && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Команда автомайстерні</h3>
                                    <p className="text-slate-600">
                                        {autorepair.workers_amount} працівників
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    onClick={() => setShowBookingModal(!showBookingModal)}>
                        Забронювати візит
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    onClick={() => handleShowAutorepairReport(autorepair.autorepair_id)}>
                        Отримати візитку автомайстерні
                    </button>
                </div>

                {showBookingModal && (
                    <BookVisit
                        autorepairName={autorepair.name}
                        autorepairId={autorepair.autorepair_id}
                        onClose={() => setShowBookingModal(false)}
                    />
                )}
            </div>
        </div>
    );

}

export default AutoRepairPage;