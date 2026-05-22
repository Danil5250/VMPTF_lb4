import React, { useState, useEffect } from 'react';
import {
    fetchAllAutorepairServices,
    addAutorepairService,
    updateAutorepairService,
    deleteAutorepairService,
    fetchAutorepairsForSelect,
    fetchServicesForSelect
} from '../api/autorepairServicesApi';
import type { AutorepairService, AutorepairForSelect, ServiceForSelect } from '../types';

const AutorepairServiceManager = () => {
    const [autorepairServices, setAutorepairServices] = useState<AutorepairService[]>([]);
    const [autorepairs, setAutorepairs] = useState<AutorepairForSelect[]>([]);
    const [services, setServices] = useState<ServiceForSelect[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<AutorepairService> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadData();
        loadSelectData();
    }, []);

    const loadData = async () => {
        const data = await fetchAllAutorepairServices();
        setAutorepairServices(data);
    };

    const loadSelectData = async () => {
        const autorepairsData = await fetchAutorepairsForSelect();
        const servicesData = await fetchServicesForSelect();
        setAutorepairs(autorepairsData);
        setServices(servicesData);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this autorepair service?')) {
            await deleteAutorepairService(id);
            loadData();
        }
    };

    const handleOpenModal = (service: Partial<AutorepairService> | null = null) => {
        setCurrentService(service || {
            autorepair_id: 0,
            service_id: 0,
            service_price: '',
            garantie_term: 0,
            duration: 0
        });
        setIsEditing(!!service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentService?.autorepair_service_id) {
                await updateAutorepairService(currentService.autorepair_service_id, currentService);
            } else {
                await addAutorepairService(currentService!);
            }
            handleCloseModal();
            loadData();
        } catch (error) {
            console.error("Error saving autorepair service:", error);
            alert("Failed to save autorepair service. Please check your input.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Autorepair Services Manager</h1>
                <button
                    onClick={() => handleOpenModal()}
                    style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Add Autorepair Service
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Autorepair Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Service Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Price (грн)</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Garantie Term</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Duration (min)</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {autorepairServices.map((ars) => (
                        <tr key={ars.autorepair_service_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>{ars.autorepair_service_id}</td>
                            <td style={{ padding: '12px' }}>{ars.autorepair_name}</td>
                            <td style={{ padding: '12px' }}>{ars.service_name}</td>
                            <td style={{ padding: '12px' }}>{ars.service_price}</td>
                            <td style={{ padding: '12px' }}>{ars.garantie_term}</td>
                            <td style={{ padding: '12px' }}>{ars.duration}</td>
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => handleOpenModal(ars)}
                                    style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(ars.autorepair_service_id)}
                                    style={{ padding: '5px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>{isEditing ? 'Edit Autorepair Service' : 'Add Autorepair Service'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Autorepair</label>
                                <select
                                    value={currentService?.autorepair_id || ''}
                                    onChange={(e) => setCurrentService({ ...currentService, autorepair_id: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                >
                                    <option value="">Select Autorepair</option>
                                    {autorepairs.map(ar => (
                                        <option key={ar.autorepair_id} value={ar.autorepair_id}>
                                            {ar.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Service</label>
                                <select
                                    value={currentService?.service_id || ''}
                                    onChange={(e) => setCurrentService({ ...currentService, service_id: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                >
                                    <option value="">Select Service</option>
                                    {services.map(s => (
                                        <option key={s.service_id} value={s.service_id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Service Price (грн)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={currentService?.service_price || ''}
                                    onChange={(e) => setCurrentService({ ...currentService, service_price: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Garantie Term (months)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={currentService?.garantie_term || 0}
                                    onChange={(e) => setCurrentService({ ...currentService, garantie_term: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={currentService?.duration || ''}
                                    onChange={(e) => setCurrentService({ ...currentService, duration: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    {isEditing ? 'Save Changes' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutorepairServiceManager;
