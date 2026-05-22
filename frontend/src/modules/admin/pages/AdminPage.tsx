
import React, { useState } from 'react';
import ClientManager from '../clients/components/ClientManager';
import ServiceManager from '../services/components/ServiceManager';
import VisitManager from '../visits/components/VisitManager';
import CarsManager from '../cars/components/CarsManager';
import AutorepairManager from '../autorepair/AutorepairManager';
import ServiceCategoryManager from '../service-category/ServiceCategoryManager';
import SpecializationManager from '../specialization/SpecializationManager';
import WorkingDaysManager from '../working-days/WorkingDaysManager';
import VisitServicesManager from '../visits-services/components/VisitServicesManager';
import AutorepairServiceManager from '../autorepair-services/components/AutorepairServiceManager';
import SpecializationAutorepairManager from '../specialization-autorepairs/SpecializationAutorepairManager';



const AdminPage = () => {
    const [activeTab, setActiveTab] = useState<'clients' | 'services' | 'visits' | 'cars' | 'autorepairs' | 'service-categories' | 'specializations' | 'working-days' | 'visit-services' | 'autorepair-services' | 'specialization-autorepairs'>('clients');



    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                backgroundColor: '#1e293b',
                color: 'white',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Admin Panel</h2>
                <button
                    onClick={() => setActiveTab('clients')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'clients' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Clients
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'services' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Services
                </button>
                <button
                    onClick={() => setActiveTab('visits')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'visits' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Visits
                </button>
                <button
                    onClick={() => setActiveTab('cars')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'cars' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Cars
                </button>
                <button
                    onClick={() => setActiveTab('autorepairs')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'autorepairs' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Autorepairs
                </button>
                <button
                    onClick={() => setActiveTab('service-categories')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'service-categories' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Service Categories
                </button>
                <button
                    onClick={() => setActiveTab('specializations')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'specializations' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Specializations
                </button>
                <button
                    onClick={() => setActiveTab('working-days')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'working-days' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Working Days
                </button>
                <button
                    onClick={() => setActiveTab('visit-services')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'visit-services' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Visit Services
                </button>
                <button
                    onClick={() => setActiveTab('autorepair-services')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'autorepair-services' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Autorepair Services
                </button>
                <button
                    onClick={() => setActiveTab('specialization-autorepairs')}
                    style={{
                        padding: '10px',
                        backgroundColor: activeTab === 'specialization-autorepairs' ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: '5px'
                    }}
                >
                    Specialization Autorepairs
                </button>


            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {activeTab === 'clients' && <ClientManager />}
                {activeTab === 'services' && <ServiceManager />}
                {activeTab === 'visits' && <VisitManager />}
                {activeTab === 'cars' && <CarsManager />}
                {activeTab === 'autorepairs' && <AutorepairManager />}
                {activeTab === 'service-categories' && <ServiceCategoryManager />}
                {activeTab === 'specializations' && <SpecializationManager />}
                {activeTab === 'working-days' && <WorkingDaysManager />}
                {activeTab === 'visit-services' && <VisitServicesManager />}
                {activeTab === 'autorepair-services' && <AutorepairServiceManager />}
                {activeTab === 'specialization-autorepairs' && <SpecializationAutorepairManager />}

            </div>

        </div>
    );
};

export default AdminPage;