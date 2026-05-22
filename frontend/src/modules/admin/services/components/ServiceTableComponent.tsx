import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Service } from "../interfaces/Service.ts";
import { updateService } from "../api/servicePageService.ts";

interface ServiceTableComponentProps {
    services: Service[];
    onDeleteClick: (id: number) => void;
}

const ServiceTableComponent: React.FC<ServiceTableComponentProps> = ({ services, onDeleteClick }) => {
    const [editableServices, setEditableServices] = useState<Service[]>([]);

    useEffect(() => {
        setEditableServices(services.map(s => ({ ...s })));
    }, [services]);

    const handleFieldChange = (id_service: number, field: keyof Service, value: string) => {
        setEditableServices(prev =>
            prev.map(s => {
                if (s.id_service !== id_service) return s;

                if (field === "base_price") {
                    return { ...s, base_price: value === "" ? 0 : parseFloat(value) };
                }
                if (field === "guarantee_period" || field === "average_duration") {
                    const parsed = value === "" ? 0 : parseInt(value, 10);
                    return { ...s, [field]: isNaN(parsed) ? 0 : parsed } as Service;
                }

                return { ...s, [field]: value } as Service;
            })
        );
    };

    const handleSaveClick = async (service: Service) => {
        try {
            const response = await updateService(String(service.id_service), service);
            if (response) {
                alert("Service updated!");
            } else {
                alert("Failed to update service");
            }
        } catch (err) {
            console.error("Error updating service:", err);
            alert("Network error. Please try again.");
        }
    };

    const renderTextInput = (service: Service, field: keyof Service) => (
        <input
            type="text"
            value={(service[field] ?? "") as unknown as string}
            onChange={(e) => handleFieldChange(service.id_service, field, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
        />
    );

    const renderNumberInput = (service: Service, field: keyof Service) => (
        <input
            type="number"
            value={(service[field] ?? 0) as unknown as number}
            onChange={(e) => handleFieldChange(service.id_service, field, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            min={0}
            step={field === "base_price" ? "0.01" : "1"}
        />
    );

    return (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-800 text-white text-center">
                <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Base Price</th>
                    <th className="px-4 py-3">Guarantee Period</th>
                    <th className="px-4 py-3">Average Duration</th>
                    <th className="px-4 py-3">Actions</th>
                </tr>
                </thead>

                <tbody className="text-gray-700 text-center">
                {editableServices.map((service) => (
                    <tr key={service.id_service} className="hover:bg-gray-100 transition-colors">
                        <td className="px-4 py-2">{service.id_service}</td>

                        <td className="px-4 py-2">
                            {renderTextInput(service, "name")}
                        </td>

                        <td className="px-4 py-2">
                <textarea
                    value={service.description ?? ""}
                    onChange={(e) => handleFieldChange(service.id_service, "description", e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    rows={2}
                />
                        </td>

                        <td className="px-4 py-2">
                            {renderNumberInput(service, "base_price")}
                        </td>

                        <td className="px-4 py-2">
                            {renderNumberInput(service, "guarantee_period")}
                        </td>

                        <td className="px-4 py-2">
                            {renderNumberInput(service, "average_duration")}
                        </td>

                        <td className="px-4 py-2 flex justify-center gap-2">
                            <button
                                onClick={() => handleSaveClick(service)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => onDeleteClick(service.id_service)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>

                            <Link
                                to={`/service-update/${service.id_service}`}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Update
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceTableComponent;
