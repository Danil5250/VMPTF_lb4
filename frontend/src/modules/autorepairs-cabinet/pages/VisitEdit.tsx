import {useEffect, useState} from "react";
import {getAllVisitsByAutorepairId} from "../api/AutorepairsCabinetApi.ts";
import {setVisitIsCompleted, updateAlternativeDateTime} from "../../visits/api/visitPageService.ts";


const VisitEdit = ({autorepairId}:{autorepairId: number}) => {
    const [visits, setVisits] = useState([]);
    const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
    const [alternativeDateTime, setAlternativeDateTime] = useState("");

    const getAllVisitsByAutorepair = async () => {
        try {
            const result = await getAllVisitsByAutorepairId(autorepairId);
            console.log(result);
            setVisits(result.data);
        }
        catch (error) {}
    }

    useEffect(() => {
        getAllVisitsByAutorepair()
    }, []);

    const toggleCompleted = async (visitId: number, currentStatus: boolean) => {

        await setVisitIsCompleted(visitId, !currentStatus);

        setVisits(visits.map(visit =>
            visit.visit_id === visitId
                ? {...visit, is_completed: !currentStatus}
                : visit
        ));
    }

    const handleSetAlternativeDate = async (visitId: number) => {
        if (!alternativeDateTime) {
            alert("Будь ласка, оберіть дату та час");
            return;
        }

        try {
            const response = await updateAlternativeDateTime(
                visitId,
                alternativeDateTime
            );

            const updatedDate = response.data?.alternative_date_time
                || alternativeDateTime;

            setVisits(prev =>
                prev.map(visit =>
                    visit.visit_id === visitId
                        ? { ...visit, date_time: updatedDate }
                        : visit
                )
            );

            setSelectedVisitId(null);
            setAlternativeDateTime("");
        } catch (error) {
            console.error("Помилка при оновленні дати:", error);
            alert("Не вдалося оновити дату. Спробуйте ще раз.");
        }
    }

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Візити автосервісу</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Дата та час</th>
                        <th className="px-4 py-2 border">Альтернативна дата</th>
                        <th className="px-4 py-2 border">Автомобіль</th>
                        <th className="px-4 py-2 border">Терміново</th>
                        <th className="px-4 py-2 border">Статус оплати</th>
                        <th className="px-4 py-2 border">Спосіб оплати</th>
                        <th className="px-4 py-2 border">Примітка</th>
                        <th className="px-4 py-2 border">Статус</th>
                        <th className="px-4 py-2 border">Дія</th>
                    </tr>
                    </thead>
                    <tbody>
                    {visits.map((visit) => (
                        <tr key={visit.visit_id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border text-center">{visit.visit_id}</td>
                            <td className="px-4 py-2 border">{formatDateTime(visit.date_time)}</td>
                            <td className="px-4 py-2 border">
                                {visit.alternative_date_time ? (
                                    <span className="text-blue-600">
                                        {formatDateTime(visit.alternative_date_time)}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="px-4 py-2 border text-center">{visit.car_id}</td>
                            <td className="px-4 py-2 border text-center">
                                {visit.is_urgent ? (
                                    <span className="text-red-600 font-semibold">Так</span>
                                ) : (
                                    <span className="text-gray-500">Ні</span>
                                )}
                            </td>
                            <td className="px-4 py-2 border">{visit.payment_status}</td>
                            <td className="px-4 py-2 border">{visit.payment_way}</td>
                            <td className="px-4 py-2 border">{visit.note || '-'}</td>
                            <td className="px-4 py-2 border text-center">
                                {visit.is_completed ? (
                                    <span className="text-green-600 font-semibold">Виконано</span>
                                ) : (
                                    <span className="text-orange-600 font-semibold">Не виконано</span>
                                )}
                            </td>
                            <td className="px-4 py-2 border text-center">
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => toggleCompleted(visit.visit_id, visit.is_completed)}
                                        className={`px-3 py-1 rounded text-white font-medium transition-colors ${
                                            visit.is_completed
                                                ? 'bg-orange-500 hover:bg-orange-600'
                                                : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    >
                                        {visit.is_completed ? 'Не виконано' : 'Виконано'}
                                    </button>

                                    {/*{visit.is_urgent && (*/}
                                        <>
                                            {selectedVisitId === visit.visit_id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="datetime-local"
                                                        value={alternativeDateTime}
                                                        onChange={(e) => {
                                                            const localValue = e.target.value;
                                                            setAlternativeDateTime(localValue);
                                                        }}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />

                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleSetAlternativeDate(visit.visit_id)}
                                                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex-1"
                                                        >
                                                            Зберегти
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedVisitId(null);
                                                                setAlternativeDateTime("");
                                                            }}
                                                            className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm flex-1"
                                                        >
                                                            Скасувати
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedVisitId(visit.visit_id)}
                                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
                                                >
                                                    Призначити дату
                                                </button>
                                            )}
                                        </>
                                    {/*)}*/}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {visits.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Немає візитів для відображення
                    </div>
                )}
            </div>
        </div>
    )
}

export default VisitEdit