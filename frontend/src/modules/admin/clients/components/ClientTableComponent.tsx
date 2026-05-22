// ClientTable.jsx
import { Link } from 'react-router-dom';
import type {Client} from "../interfaces/Client.ts";
import {useState} from "react";
import {updateClient} from "../api/clientPageService.ts";

interface ClientTableProps {
    clients: Client[];
    onDeleteClick: (id: number) => void;
}

const ClientTable = ({ clients, onDeleteClick }: ClientTableProps) => {

    const [editableClients, setEditableClients] = useState(clients);

    const handleFieldChange = (id_client, field, value) => {
        setEditableClients(prev =>
            prev.map(c =>
                c.id_client === id_client ? { ...c, [field]: value } : c
            )
        );
    };

    const handleSaveClick = async (client) => {
        try {
            const response = await updateClient(
                String(client.id_client),
                client
            );

            if (response) {
                alert("Client updated!");
            } else {
                alert("Failed to update client");
            }

        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    };

    const renderInput = (client, field) => (
        <input
            type="text"
            value={client[field] ?? ""}
            onChange={(e) => handleFieldChange(client.id_client, field, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
        />
    );


    return (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white mt-8">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-800 text-white text-center">
                <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Surname</th>
                    <th className="px-4 py-3">Middlename</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Actions</th>
                </tr>
                </thead>

                <tbody className="text-gray-700 text-center">
                {editableClients.map((client) => (
                    <tr
                        key={client.id_client}
                        className="hover:bg-gray-100 transition-colors"
                    >

                        <td className="px-4 py-2 font-semibold">{client.id_client}</td>

                        <td className="px-4 py-2">{renderInput(client, "name")}</td>

                        <td className="px-4 py-2">{renderInput(client, "surname")}</td>

                        <td className="px-4 py-2">{renderInput(client, "middlename")}</td>

                        <td className="px-4 py-2">{renderInput(client, "email")}</td>

                        <td className="px-4 py-2">{renderInput(client, "phone")}</td>

                        <td className="px-4 py-2">
                            <Link
                                to={`/client-info/${client.id_client}`}
                                className="text-blue-600 hover:underline"
                            >
                                More details
                            </Link>
                        </td>

                        <td className="px-4 py-2 flex justify-center gap-2">

                            <button
                                onClick={() => handleSaveClick(client)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => onDeleteClick(client.id_client)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>

                            <Link to={`/client-update/${client.id_client}`} className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-blue-700 transition" > Update </Link>
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientTable;