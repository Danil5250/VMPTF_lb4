import React, { useEffect, useState } from 'react';
import { fetchAllWorkingDays, createWorkingDay, updateWorkingDay, deleteWorkingDay, type WorkingDay } from './api';
import { fetchAllAutorepairs, type Autorepair } from '../autorepair/api/autorepairApi';
import { Trash2, Plus, X, Edit, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

const WorkingDaysManager = () => {
    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
    const [autorepairs, setAutorepairs] = useState<Autorepair[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkingDay, setEditingWorkingDay] = useState<WorkingDay | null>(null);

    // Form State
    const [dayOfWeek, setDayOfWeek] = useState('Пн');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('18:00');
    const [comment, setComment] = useState('');
    const [autorepairId, setAutorepairId] = useState<number>(0);

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [workingDaysData, autorepairsData] = await Promise.all([
                fetchAllWorkingDays(),
                fetchAllAutorepairs()
            ]);
            setWorkingDays(workingDaysData || []);
            setAutorepairs(autorepairsData || []);
            if (autorepairsData && autorepairsData.length > 0 && autorepairId === 0) {
                setAutorepairId(autorepairsData[0].autorepair_id!);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        }
    };

    const handleEdit = (workingDay: WorkingDay) => {
        setEditingWorkingDay(workingDay);
        setDayOfWeek(workingDay.day_of_week);
        setStartTime(workingDay.start_time_working);
        setEndTime(workingDay.end_time_working);
        setComment(workingDay.comment || '');
        setAutorepairId(workingDay.autorepair_id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteWorkingDay(id);
                Swal.fire('Deleted!', 'Record has been deleted.', 'success');
                loadData();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete record', 'error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: WorkingDay = {
            day_of_week: dayOfWeek,
            start_time_working: startTime,
            end_time_working: endTime,
            comment,
            autorepair_id: autorepairId
        };

        // Ensure autorepair_id is set
        if (!payload.autorepair_id && autorepairs.length > 0) {
            payload.autorepair_id = autorepairs[0].autorepair_id!;
        } else if (!payload.autorepair_id) {
            Swal.fire('Error', 'Please select an Autorepair', 'error');
            return;
        }

        try {
            if (editingWorkingDay && editingWorkingDay.schedule_id) {
                await updateWorkingDay(editingWorkingDay.schedule_id, payload);
                Swal.fire('Success', 'Record updated successfully!', 'success');
            } else {
                await createWorkingDay(payload);
                Swal.fire('Success', 'Record created successfully!', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', 'Operation failed', 'error');
        }
    };

    const resetForm = () => {
        setEditingWorkingDay(null);
        setDayOfWeek('Пн');
        setStartTime('08:00');
        setEndTime('18:00');
        setComment('');
        if (autorepairs.length > 0) {
            setAutorepairId(autorepairs[0].autorepair_id!);
        } else {
            setAutorepairId(0);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="text-blue-600" /> Working Days Management
                </h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Schedule
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">Day</th>
                                <th className="p-4 font-medium">Start Time</th>
                                <th className="p-4 font-medium">End Time</th>
                                <th className="p-4 font-medium">Comment</th>
                                <th className="p-4 font-medium">Autorepair</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {workingDays.map((item) => (
                                <tr key={item.schedule_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{item.day_of_week}</td>
                                    <td className="p-4">{item.start_time_working}</td>
                                    <td className="p-4">{item.end_time_working}</td>
                                    <td className="p-4 text-gray-500">{item.comment}</td>
                                    <td className="p-4 font-medium text-blue-600">{item.autorepair_name}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.schedule_id!)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {workingDays.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No working days found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingWorkingDay ? 'Edit Schedule' : 'Add New Schedule'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Autorepair</label>
                                <select
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={autorepairId}
                                    onChange={(e) => setAutorepairId(Number(e.target.value))}
                                >
                                    <option value={0} disabled>Select Autorepair</option>
                                    {autorepairs.map(ar => (
                                        <option key={ar.autorepair_id} value={ar.autorepair_id}>
                                            {ar.name} ({ar.adress})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                                <select
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                >
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Optional comment..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingWorkingDay ? 'Update Schedule' : 'Create Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkingDaysManager;
