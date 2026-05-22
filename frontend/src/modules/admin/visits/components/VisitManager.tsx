import React, { useEffect, useState } from 'react';
import { fetchAllVisits, addVisit, updateVisit, deleteVisitById, fetchAllAutorepairs, fetchCarsByClientId, getVisitServices } from '../api/visitPageService';
import { getAllClients } from '../../clients/api/clientPageService';
import { Trash2, Plus, X, Edit } from 'lucide-react';
import Swal from 'sweetalert2';
import Select from 'react-select';

import { getAllServices } from '../../services/api/servicePageService';
import { getAllCars } from "../../cars/api/apiCars.ts";
import { getAutorepairsServices } from "../../autorepair-services/api/autorepairServicesApi.ts";


const VisitManager = () => {
    const [visits, setVisits] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [cars, setCars] = useState<any[]>([]);
    const [allCars, setAllCars] = useState<any[]>([]);
    const [autorepairs, setAutorepairs] = useState<any[]>([]);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [filteredServiceOptions, setFilteredServiceOptions] = useState<any[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVisit, setEditingVisit] = useState<any>(null);

    // Form State
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [selectedCar, setSelectedCar] = useState<any>(null);
    const [selectedAutorepair, setSelectedAutorepair] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [dateTime, setDateTime] = useState('');
    const [note, setNote] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    // New Fields
    const [alternativeDateTime, setAlternativeDateTime] = useState('');
    const [paymentWay, setPaymentWay] = useState<'готівка' | 'картка'>('готівка');
    const [paymentStatus, setPaymentStatus] = useState<'оплачено' | 'не оплачено'>('не оплачено');
    const [isCompleted, setIsCompleted] = useState(false);


    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        const [visitsData, clientsData, autorepairsData, servicesData, carsData] = await Promise.all([
            fetchAllVisits(),
            getAllClients(),
            fetchAllAutorepairs(),
            getAllServices(),
            getAllCars()
        ]);

        console.log(visitsData);

        if (visitsData && visitsData.onlyVisits) {
            setVisits(visitsData.onlyVisits);
        } else if (Array.isArray(visitsData)) {
            setVisits(visitsData);
        } else {
            setVisits([]);
        }

        setClients(clientsData || []);
        setAutorepairs(autorepairsData || []);
        setAvailableServices(servicesData || []);
        setAllCars(carsData?.data || []);
    };

    const handleClientChange = async (option: any) => {
        setSelectedClient(option);
        setSelectedCar(null);
        setCars([]);
        if (option?.value) {
            const carsData = await fetchCarsByClientId(option.value);
            setCars(carsData || []);
        }
    };

    const handleAutorepairChange = async (option: any) => {
        setSelectedAutorepair(option);
        setSelectedServices([]);
        setFilteredServiceOptions([]);

        if (option?.value) {
            try {
                const servicesResponse = await getAutorepairsServices(option.value);
                const services = servicesResponse?.data || [];
                const options = services.map((s: any) => ({
                    value: s.service_id,
                    label: `${s.service_name} (${s.service_price} грн)`
                }));
                setFilteredServiceOptions(options);
            } catch (error) {
                console.error("Failed to load autorepair services", error);
                Swal.fire('Error', 'Failed to load services for this autorepair', 'error');
            }
        }
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
            await deleteVisitById(id);
            Swal.fire('Deleted!', 'Visit has been deleted.', 'success');
            loadInitialData();
        }
    };

    const openEditModal = async (visit: any) => {
        setEditingVisit(visit);

        let currentAutorepairServices: any[] = [];
        try {
            const servicesResponse = await getAutorepairsServices(visit.autorepair_id)
            const services = servicesResponse?.data || [];
            currentAutorepairServices = services.map((s: any) => ({
                value: s.service_id,
                label: `${s.service_name} (${s.service_price} грн)`
            }));
            setFilteredServiceOptions(currentAutorepairServices);
        } catch (error) {
            console.error("Failed to fetch autorepair services", error);
        }


        const car = allCars.find(c => c.car_id === visit.car_id);
        let client = null;
        if (car) {
            client = clients.find(c => c.client_id === car.client_id);
        }

        if (client) {
            const clientOption = { value: client.client_id, label: `${client.name} ${client.surname} (${client.email})` };
            setSelectedClient(clientOption);

            const carsData = await fetchCarsByClientId(client.client_id);
            setCars(carsData || []);

            if (car) {
                setSelectedCar({ value: car.car_id, label: `${car.brand} ${car.model} (${car.license_plate})` });
            }
        }

        const ar = autorepairs.find(a => a.autorepair_id === visit.autorepair_id);
        if (ar) {
            setSelectedAutorepair({ value: ar.autorepair_id, label: ar.name });
        }

        try {
            const visitServices = await getVisitServices(visit.visit_id);
            if (visitServices && Array.isArray(visitServices)) {
                const selectedSrvs = visitServices.map((row: any) => {
                    const s = currentAutorepairServices.find(as => as.value === row.service_id);
                    if (s) return s;

                    const globalS = availableServices.find(as => as.service_id === row.service_id);
                    return globalS ? { value: globalS.service_id, label: globalS.name } : null;
                }).filter((item: any) => item !== null);

                setSelectedServices(selectedSrvs);
            } else {
                setSelectedServices([]);
            }
        } catch (e) {
            console.error("Failed to load visit services", e);
            setSelectedServices([]);
        }


        // Other fields
        if (visit.date_time) {
            const dt = new Date(visit.date_time);
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            setDateTime(dt.toISOString().slice(0, 16));
        }

        if (visit.alternative_date_time) {
            const dt = new Date(visit.alternative_date_time);
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            setAlternativeDateTime(dt.toISOString().slice(0, 16));
        } else {
            setAlternativeDateTime('');
        }

        setNote(visit.note || '');
        setIsUrgent(visit.is_urgent || false);
        setPaymentWay(visit.payment_way || 'готівка');
        setPaymentStatus(visit.payment_status || 'не оплачено');
        setIsCompleted(visit.is_completed || false);

        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCar || !selectedAutorepair || !dateTime) {
            Swal.fire('Error', 'Please fill all required fields', 'error');
            return;
        }

        const payload = {
            client_id: selectedClient?.value,
            car_id: selectedCar.value,
            autorepair_id: selectedAutorepair.value,
            services_ids: selectedServices.map(s => s.value),
            date_time: dateTime,
            alternative_date_time: alternativeDateTime || null,
            note: note,
            is_urgent: isUrgent,
            payment_way: paymentWay,
            payment_status: paymentStatus,
            is_completed: isCompleted
        };

        if (editingVisit) {
            // @ts-ignore
            await updateVisit(editingVisit.visit_id, payload);
            Swal.fire('Success', 'Visit updated successfully!', 'success');
        } else {
            await addVisit(payload);
            Swal.fire('Success', 'Visit created successfully', 'success');
        }

        setIsModalOpen(false);
        resetForm();
        loadInitialData();
    };



    const resetForm = () => {
        setEditingVisit(null);
        setSelectedClient(null);
        setSelectedCar(null);
        setSelectedAutorepair(null);
        setSelectedServices([]);
        setFilteredServiceOptions([]);
        setDateTime('');
        setAlternativeDateTime('');
        setNote('');
        setIsUrgent(false);
        setPaymentWay('готівка');
        setPaymentStatus('не оплачено');
        setIsCompleted(false);
        setCars([]);
        setIsModalOpen(true);
    };

    const clientOptions = clients.map(c => ({ value: c.client_id, label: `${c.name} ${c.surname} (${c.email})` }));
    const carOptions = cars.map(c => ({ value: c.car_id, label: `${c.brand} ${c.model} (${c.license_plate})` }));
    const autorepairOptions = autorepairs.map(a => ({ value: a.autorepair_id, label: a.name }));

    // Payment Options match enum in DTO/Backend
    const paymentWayOptions = [
        { value: 'готівка', label: 'Cash (Готівка)' },
        { value: 'картка', label: 'Card (Картка)' }
    ];

    const paymentStatusOptions = [
        { value: 'не оплачено', label: 'Not Paid (Не оплачено)' },
        { value: 'оплачено', label: 'Paid (Оплачено)' }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Visit Management</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Visit
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Car Info</th>
                                <th className="p-4 font-medium">Autorepair</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {visits.map((visit) => (
                                <tr key={visit.visit_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">{new Date(visit.date_time).toLocaleString()}</td>
                                    <td className="p-4">
                                        {(() => {
                                            const car = allCars.find(c => c.car_id === visit.car_id);
                                            if (!car) return visit.car_id;

                                            return (
                                                <>
                                                    {car.brand} {car.model}
                                                    <br />
                                                    Номер автомобіля: {car.license_plate}
                                                    <br />
                                                    VIN: {car.vin}
                                                </>
                                            );
                                        })()}
                                        {
                                        }</td>
                                    <td className="p-4">
                                        {autorepairs.find(a => a.autorepair_id == visit.autorepair_id).name || visit.autorepair_id}</td>
                                    <td className="p-4 text-sm font-medium">
                                        <span className={`px-2 py-1 rounded-full ${visit.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {visit.is_completed ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => openEditModal(visit)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(visit.visit_id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-visible">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingVisit ? 'Edit Visit' : 'Create New Visit'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6 max-h-[80vh] overflow-y-auto">

                            {/* Client & Car Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                                    <Select
                                        options={clientOptions}
                                        value={selectedClient}
                                        onChange={handleClientChange}
                                        placeholder="Search client..."
                                        isClearable
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Car</label>
                                    <Select
                                        options={carOptions}
                                        value={selectedCar}
                                        onChange={setSelectedCar}
                                        placeholder={selectedClient ? "Select car..." : "Select a client first"}
                                        isDisabled={!selectedClient}
                                        isClearable
                                    />
                                </div>
                            </div>

                            {/* Autorepair & Services Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Autorepair</label>
                                <Select
                                    options={autorepairOptions}
                                    value={selectedAutorepair}
                                    onChange={handleAutorepairChange}
                                    placeholder="Select autorepair..."
                                    isClearable
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                                <Select
                                    options={filteredServiceOptions}
                                    value={selectedServices}
                                    onChange={(val) => setSelectedServices(val as any[])}
                                    isMulti
                                    placeholder={selectedAutorepair ? "Select services..." : "Select an autorepair first"}
                                    isDisabled={!selectedAutorepair}
                                />
                            </div>

                            {/* Dates Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={dateTime}
                                        onChange={(e) => setDateTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={alternativeDateTime}
                                        onChange={(e) => setAlternativeDateTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Payment Section - Only show when editing, or maybe allow for create too? usually create is not paid yet. But let's allow it */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <Select
                                        options={paymentWayOptions}
                                        value={paymentWayOptions.find(o => o.value === paymentWay)}
                                        onChange={(opt: any) => setPaymentWay(opt?.value)}
                                        placeholder="Select payment method..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                    <Select
                                        options={paymentStatusOptions}
                                        value={paymentStatusOptions.find(o => o.value === paymentStatus)}
                                        onChange={(opt: any) => setPaymentStatus(opt?.value)}
                                        placeholder="Select payment status..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isUrgent"
                                        checked={isUrgent}
                                        onChange={(e) => setIsUrgent(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">Is Urgent?</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isCompleted"
                                        checked={isCompleted}
                                        onChange={(e) => setIsCompleted(e.target.checked)}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="isCompleted" className="text-sm font-medium text-gray-700">Is Completed?</label>
                                </div>
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
                                    {editingVisit ? 'Update Visit' : 'Create Visit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitManager;
