import {ChevronDown, Edit2, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {useAuth} from "../../components/auth/AuthContext.tsx";
import {deleteClientById, getClient, updateClient} from "../../clients/api/clientPageService.ts";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";


const ClientsProfile = () => {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useAuth()


    useEffect(() => {
        const fetchClientData = async () => {
            const result = await getClient(user.id)

            setName(result.client.name)
            setSurname(result.client.surname ?? "")
            setMiddlename(result.client.middlename ?? "")
            setPhoneNumber(result.client.phone)
            setEmail(result.client.email)
        }

        fetchClientData()
    }, []);


    const handleUpdate = async() => {
        await Swal.fire({
            title: "Оновлення даних профілю",
            text: "Чи впевнені, що потрібно оновити дані на ці?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Так"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const result = await updateClient(user.id,
                        {id_client: user.id, email,
                            middlename, name, surname, phone:phoneNumber})

                    console.log(result);
                }
                catch(err) {
                    const text = error.response?.data?.message || error.message || "Something went wrong!";
                    await Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text
                    });
                }
            }
        })
    }


    const handleDelete = async() => {
        await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if(user.id) {
                        await deleteClientById(user?.id)
                        logout();
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your account has been deleted.",
                            icon: "success"
                        });
                        navigate('/')
                    }
                }
                catch {
                    await Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!"
                    });
                }

            }
        });
    }

    return (
                <main className="flex-1 overflow-auto p-8">
                    <div className="mx-auto grid grid-cols-1 gap-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Особисті дані</h2>

                            <div className="space-y-5">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ім'я
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Прізвище
                                    </label>
                                    <input
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        По батькові
                                    </label>
                                    <input
                                        type="text"
                                        value={middlename}
                                        onChange={(e) => setMiddlename(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Phone Number Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Телефонний номер
                                    </label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Адреса електронної пошти
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        className="px-8 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                        onClick={() => handleUpdate()}
                                    >
                                        ЗБЕРЕГТИ
                                    </button>
                                </div>
                            </div>
                        </div>



                        {/* Account Management Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Керувати обліковим записом</h2>

                            <div className="flex gap-4">
                                <button
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => handleDelete()}
                                >
                                    <Trash2 className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">Видалити обліковий запис</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
        );
}

export default ClientsProfile;