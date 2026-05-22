
import React, { useEffect, useState } from 'react';
import { fetchAllAutorepairs, createAutorepair, updateAutorepair, deleteAutorepair, type Autorepair } from './api/autorepairApi';
import { Trash2, Plus, X, Edit, Wrench } from 'lucide-react';
import Swal from 'sweetalert2';

const AutorepairManager = () => {
    const [autorepairs, setAutorepairs] = useState<Autorepair[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAutorepair, setEditingAutorepair] = useState<Autorepair | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [adress, setAdress] = useState('');
    const [index, setIndex] = useState('');
    const [workersAmount, setWorkersAmount] = useState<number>(1);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [ranking, setRanking] = useState<number>(0);
    const [password, setPassword] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await fetchAllAutorepairs();
            setAutorepairs(result || []);
        } catch (error) {
            console.error("Error loading data:", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        }
    };

    const handleEdit = (autorepair: Autorepair) => {
        setEditingAutorepair(autorepair);
        setName(autorepair.name);
        setDescription(autorepair.description || '');
        setAdress(autorepair.adress || '');
        setIndex(autorepair.index || '');
        setWorkersAmount(autorepair.workers_amount || 1);
        setPhone(autorepair.phone || '');
        setEmail(autorepair.email || '');
        setRanking(autorepair.ranking || 0);
        setPassword(autorepair.password || '');
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
                await deleteAutorepair(id);
                Swal.fire('Deleted!', 'Autorepair has been deleted.', 'success');
                loadData();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete autorepair', 'error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Autorepair = {
            name,
            description,
            adress,
            index,
            workers_amount: workersAmount,
            phone,
            email,
            ranking,
            password
        };

        try {
            if (editingAutorepair && editingAutorepair.autorepair_id) {
                await updateAutorepair(editingAutorepair.autorepair_id, payload);
                Swal.fire('Success', 'Autorepair updated successfully!', 'success');
            } else {
                await createAutorepair(payload);
                Swal.fire('Success', 'Autorepair created successfully!', 'success');
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
        setEditingAutorepair(null);
        setName('');
        setDescription('');
        setAdress('');
        setIndex('');
        setWorkersAmount(1);
        setPhone('');
        setEmail('');
        setRanking(0);
        setPassword('');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Wrench className="text-blue-600" /> Autorepair Management
                </h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Autorepair
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium">Contacts</th>
                                <th className="p-4 font-medium">Details</th>
                                <th className="p-4 font-medium">Ranking</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {autorepairs.map((autorepair) => (
                                <tr key={autorepair.autorepair_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{autorepair.name}</td>
                                    <td className="p-4">
                                        <div className="text-sm">{autorepair.adress}</div>
                                        <div className="text-xs text-gray-500">{autorepair.index}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">{autorepair.phone}</div>
                                        <div className="text-sm text-blue-500">{autorepair.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">Workers: {autorepair.workers_amount}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs" title={autorepair.description}>{autorepair.description}</div>
                                    </td>
                                    <td className="p-4">
                                        {Number(autorepair.ranking).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEdit(autorepair)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(autorepair.autorepair_id!)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {autorepairs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No autorepairs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingAutorepair ? 'Edit Autorepair' : 'Add New Autorepair'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Best Auto Repair"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={adress}
                                        onChange={(e) => setAdress(e.target.value)}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Index (Zip)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={index}
                                        onChange={(e) => setIndex(e.target.value)}
                                        placeholder="Zip code"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Workers Amount</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={workersAmount}
                                        onChange={(e) => setWorkersAmount(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ranking (0-5)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.01"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={ranking}
                                        onChange={(e) => setRanking(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Secure password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Autorepair description..."
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
                                    {editingAutorepair ? 'Update Autorepair' : 'Create Autorepair'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutorepairManager;
