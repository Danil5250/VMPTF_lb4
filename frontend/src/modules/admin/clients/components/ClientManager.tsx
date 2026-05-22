import React, { useEffect, useState } from 'react';
import { getAllClients, addClient, updateClient, deleteClientById } from '../api/clientPageService';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface Client {
    client_id?: number;
    name: string;
    surname: string;
    middlename: string;
    email: string;
    phone: string;
    login: string;
    password?: string;
}

const ClientManager = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState<Client>({
        name: '',
        surname: '',
        middlename: '',
        email: '',
        phone: '',
        login: '',
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const data = await getAllClients();
        setClients(data);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            await deleteClientById(id);
            Swal.fire('Deleted!', 'Client has been deleted.', 'success');
            fetchClients();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient && editingClient.client_id) {
            // @ts-ignore
            await updateClient(editingClient.client_id.toString(), formData);
            Swal.fire('Updated!', 'Client has been updated.', 'success');
        } else {
            // @ts-ignore
            await addClient(formData);
            Swal.fire('Added!', 'Client has been added.', 'success');
        }
        setIsModalOpen(false);
        fetchClients();
        resetForm();
    };

    const openEditModal = (client: any) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            surname: client.surname,
            middlename: client.middlename || '',
            email: client.email,
            phone: client.phone || '',
            login: client.login || '',
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingClient(null);
        setFormData({
            name: '',
            surname: '',
            middlename: '',
            email: '',
            phone: '',
            login: '',
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Client
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Phone</th>
                            <th className="p-4 font-medium">Login</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clients.map((client) => (
                            <tr key={client.client_id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">{client.name} {client.surname}</td>
                                <td className="p-4">{client.email}</td>
                                <td className="p-4">{client.phone}</td>
                                <td className="p-4">{client.login}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => openEditModal(client)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.client_id)}
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingClient ? 'Edit Client' : 'Add New Client'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Surname</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.surname}
                                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.middlename}
                                    onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Login</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.login}
                                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                                    {editingClient ? 'Update Client' : 'Create Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManager;
