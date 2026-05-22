import React, { useEffect, useState } from 'react';
import { getAllCars, createCar, updateCar, deleteCar } from '../api/apiCars';
import { getAllClients } from '../../clients/api/clientPageService';
import { Trash2, Plus, X, Edit, Car } from 'lucide-react';
import Swal from 'sweetalert2';
import Select from 'react-select';

const CarsManager = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<any>(null);

    // Form State
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [engineType, setEngineType] = useState('');
    const [year, setYear] = useState('');
    const [insurance, setInsurance] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vin, setVin] = useState('');
    const [selectedClient, setSelectedClient] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [carsRes, clientsRes] = await Promise.all([
                getAllCars(),
                getAllClients()
            ]);
            setCars(carsRes.data || []);
            setClients(clientsRes || []);
        } catch (error) {
            console.error("Error loading data:", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        }
    };

    const handleEdit = (car: any) => {
        setEditingCar(car);
        setBrand(car.brand);
        setModel(car.model);
        setEngineType(car.engine_type);
        setYear(car.year);
        setInsurance(car.insurance ? new Date(car.insurance).toISOString().split('T')[0] : '');
        setLicensePlate(car.license_plate);
        setVin(car.vin);

        const client = clients.find(c => c.client_id === car.client_id);
        if (client) {
            setSelectedClient({ value: client.client_id, label: `${client.name} ${client.surname} (${client.email})` });
        } else {
            setSelectedClient(null);
        }

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
                await deleteCar(id);
                Swal.fire('Deleted!', 'Car has been deleted.', 'success');
                loadData();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete car', 'error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedClient) {
            Swal.fire('Error', 'Please select a client', 'error');
            return;
        }

        const payload = {
            brand,
            model,
            engine_type: engineType,
            year: Number(year),
            insurance: insurance ? new Date(insurance).toISOString() : null,
            license_plate: licensePlate,
            vin,
            client_id: selectedClient.value
        };

        try {
            if (editingCar) {
                await updateCar(editingCar.car_id, payload);
                Swal.fire('Success', 'Car updated successfully!', 'success');
            } else {
                await createCar(payload);
                Swal.fire('Success', 'Car created successfully!', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const resetForm = () => {
        setEditingCar(null);
        setBrand('');
        setModel('');
        setEngineType('');
        setYear('');
        setInsurance('');
        setLicensePlate('');
        setVin('');
        setSelectedClient(null);
    };

    const clientOptions = clients.map(c => ({
        value: c.client_id,
        label: `${c.name} ${c.surname} (${c.email})`
    }));

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Car className="text-blue-600" /> Car Management
                </h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Car
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">Car Info</th>
                                <th className="p-4 font-medium">License / VIN</th>
                                <th className="p-4 font-medium">Type / Year</th>
                                <th className="p-4 font-medium">Client</th>
                                <th className="p-4 font-medium">Insurance</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cars.map((car) => (
                                <tr key={car.car_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{car.brand} {car.model}</td>
                                    <td className="p-4">
                                        <div className="text-sm">{car.license_plate}</div>
                                        <div className="text-xs text-gray-500">{car.vin}</div>
                                    </td>
                                    <td className="p-4">
                                        <div>{car.engine_type}</div>
                                        <div className="text-sm text-gray-500">{car.year}</div>
                                    </td>
                                    <td className="p-4">
                                        {car.client_name} {car.client_surname}
                                    </td>
                                    <td className="p-4">
                                        {car.insurance ? new Date(car.insurance).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEdit(car)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(car.car_id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cars.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No cars found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingCar ? 'Edit Car' : 'Add New Car'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">

                            {/* Client Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner (Client)</label>
                                <Select
                                    options={clientOptions}
                                    value={selectedClient}
                                    onChange={setSelectedClient}
                                    placeholder="Select client..."
                                    isClearable
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="e.g. Toyota"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="e.g. Camry"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={engineType}
                                        onChange={(e) => setEngineType(e.target.value)}
                                        placeholder="e.g. Hybrid"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input
                                        type="number"
                                        required
                                        min="1886"
                                        max={new Date().getFullYear() + 1}
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={licensePlate}
                                        onChange={(e) => setLicensePlate(e.target.value)}
                                        placeholder="e.g. AA1234BB"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={vin}
                                        onChange={(e) => setVin(e.target.value)}
                                        placeholder="17 characters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={insurance}
                                    onChange={(e) => setInsurance(e.target.value)}
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
                                    {editingCar ? 'Update Car' : 'Create Car'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarsManager;
