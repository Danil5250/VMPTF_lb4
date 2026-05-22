import React, { useState, useEffect } from 'react';
import {
    fetchAllVisitServices,
    addVisitService,
    updateVisitService,
    deleteVisitService,
    fetchVisitsForSelect,
    fetchAutorepairServicesForSelect
} from '../api/visitServicesPageService';

interface VisitService {
    visit_service_id: number;
    problem_description: string;
    visit_id: number;
    visit_date_time: string;
    autorepair_service_id: number;
    service_price: string;
    service_name: string;
    autorepair_name: string;
}

const VisitServicesManager = () => {
    const [visitServices, setVisitServices] = useState<VisitService[]>([]);
    const [visits, setVisits] = useState<any[]>([]);
    const [autorepairServices, setAutorepairServices] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVisitService, setCurrentVisitService] = useState<Partial<VisitService> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadData();
        loadSelectData();
    }, []);

    const loadData = async () => {
        const data = await fetchAllVisitServices();
        setVisitServices(data);
    };

    const loadSelectData = async () => {
        const visitsData = await fetchVisitsForSelect();
        const servicesData = await fetchAutorepairServicesForSelect();
        setVisits(visitsData);
        setAutorepairServices(servicesData);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            await deleteVisitService(id);
            loadData();
        }
    };

    const handleOpenModal = (visitService: Partial<VisitService> | null = null) => {
        setCurrentVisitService(visitService || { problem_description: '', visit_id: 0, autorepair_service_id: 0 });
        setIsEditing(!!visitService);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentVisitService(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && currentVisitService?.visit_service_id) {
            await updateVisitService(currentVisitService.visit_service_id, currentVisitService);
        } else {
            await addVisitService(currentVisitService);
        }
        handleCloseModal();
        loadData();
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Visit Services Manager</h1>
                <button
                    onClick={() => handleOpenModal()}
                    style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Add Visit Service
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Problem Description</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Visit (ID & Date)</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Service Info</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {visitServices.map((vs) => (
                        <tr key={vs.visit_service_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>{vs.visit_service_id}</td>
                            <td style={{ padding: '12px' }}>{vs.problem_description || '—'}</td>
                            <td style={{ padding: '12px' }}>
                                ID: {vs.visit_id}<br />
                                <small>{new Date(vs.visit_date_time).toLocaleString()}</small>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <b>{vs.service_name}</b><br />
                                Price: {vs.service_price} грн<br />
                                <small>Repair: {vs.autorepair_name}</small>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => handleOpenModal(vs)}
                                    style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(vs.visit_service_id)}
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
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px' }}>
                        <h2>{isEditing ? 'Edit Visit Service' : 'Add Visit Service'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Problem Description</label>
                                <textarea
                                    value={currentVisitService?.problem_description || ''}
                                    onChange={(e) => setCurrentVisitService({ ...currentVisitService, problem_description: e.target.value })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    rows={3}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Visit</label>
                                <select
                                    value={currentVisitService?.visit_id || ''}
                                    onChange={(e) => setCurrentVisitService({ ...currentVisitService, visit_id: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                >
                                    <option value="">Select Visit</option>
                                    {visits.map(v => (
                                        <option key={v.visit_id} value={v.visit_id}>
                                            ID: {v.visit_id} - {new Date(v.date_time).toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Autorepair Service</label>
                                <select
                                    value={currentVisitService?.autorepair_service_id || ''}
                                    onChange={(e) => setCurrentVisitService({ ...currentVisitService, autorepair_service_id: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    required
                                >
                                    <option value="">Select Service</option>
                                    {autorepairServices.map(s => (
                                        <option key={s.autorepair_service_id} value={s.autorepair_service_id}>
                                            {s.service_name} ({s.service_price} грн) - {s.autorepair_name}
                                        </option>
                                    ))}
                                </select>
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

export default VisitServicesManager;
