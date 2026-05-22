import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ServicesPage from "./modules/services/pages/ServicesPage.tsx";
import HomePage from "./modules/home/pages/HomePage.tsx";
import AutorepairsPage from "./modules/autorepairs/pages/AutorepairsPage.tsx";
import AutoRepairPage from "./modules/autorepairs/pages/AutoRepairPage.tsx";
import ClientMainPage from "./modules/client-main/pages/ClientMainPage.tsx";
import PrivateRoute from "./modules/components/auth/PrivateRoute.tsx";
import AutorepairCabinet from "./modules/autorepairs-cabinet/pages/AutorepairsCabinet.tsx";
import AutorepairsPageHighlight from "./modules/autorepairs/pages/AutorepairsPageHighlight.tsx";
import ServicesPageHighlight from "./modules/services/pages/ServicesPageHighlight.tsx";
import {LoginAutorepair} from "./modules/auth/api/AuthApi.ts";
import AutoWorkshopLogin from "./modules/auth/pages/autorepair/LoginAutorepairPage.tsx";
import AdminPage from "./modules/admin/pages/AdminPage.tsx";

function App() {
    return(
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<HomePage />}></Route>
                {/*<Route path="/autorepairs" element={<AutorepairsPage/>}></Route>*/}
                <Route path="/autorepairs" element={<AutorepairsPageHighlight/>}></Route>
                <Route path="/autorepair/:id" element={<AutoRepairPage/>}></Route>
                {/*<Route path="/services" element={<ServicesPage/>}></Route>*/}
                <Route path="/services" element={<ServicesPageHighlight/>}></Route>
                <Route path="/autorepair-cabinet/:id" element={<AutorepairCabinet/>}></Route>
                <Route path="/client-main" element={
                    <PrivateRoute>
                    <ClientMainPage/>
                        </PrivateRoute>
                }></Route>
                <Route path='/admin' element={<AdminPage />}></Route>

                {/*<Route path="/" element={<Navigate to="/visits" replace />}/>*/}
                {/*<Route path="/visits" element={ <VisitsPage /> } />*/}
                {/*<Route path="/visitsUpdate/:id" element={ <UpdateVisitPage /> } />*/}
                {/*<Route path="/clients" element={ <ClientsPage /> } />*/}
                {/*<Route path="/services" element={ <ServicesPage /> } />*/}
                {/*<Route path="/add-client" element={ <AddClientPage /> } />*/}
                {/*<Route path="/add-service" element={ <AddServicePage /> } />*/}
                {/*<Route path="/add-visit" element={ <AddVisitPage /> } />*/}
                {/*<Route path="/client-info/:id" element={ <ClientInfoPage /> } />*/}
                {/*<Route path="/client-update/:id" element={ <UpdateClientPage /> } />*/}
                {/*<Route path="/service-update/:id" element={ <UpdateServicePage /> } />*/}
                {/*<Route path="/add-visit" element={ <AddVisitPage /> } />*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App
