import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ParticipantePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.rol !== "Participante") {
            navigate("/login");
            return;
        }

        const fetchReservas = async () => {
            try {
                const token = localStorage.getItem("token"); // 🔹 Recuperar el token guardado
                const response = await fetch(
                    `http://localhost:5000/reservas/${user.ci}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`, // 🔹 Mandar el token al backend
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setReservas(Array.isArray(data) ? data : []); // 🔹 Evita error si no es array
            } catch (error) {
                console.error("Error al cargar reservas:", error);
                setReservas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="text-blue-800 text-lg font-semibold animate-pulse">
                    Cargando reservas...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
            {/* Navbar */}
            <header className="bg-white/40 backdrop-blur-md shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <h1 className="text-xl font-bold text-blue-900">Mi ReservApp</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-medium">
                            {user?.nombre} {user?.apellido}
                        </span>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                navigate("/login");
                            }}
                            className="bg-blue-800 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
                    Mis Reservas
                </h2>

                {reservas.length === 0 ? (
                    <p className="text-gray-600 text-center">
                        No tienes reservas registradas aún.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {reservas.map((reserva) => (
                            <div
                                key={reserva.id}
                                className="bg-white/50 backdrop-blur-md p-5 rounded-xl shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    {reserva.sala}
                                </h3>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Fecha:</span> {reserva.fecha}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Hora:</span>{" "}
                                    {reserva.hora_inicio} - {reserva.hora_fin}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Estado:</span>{" "}
                                    <span
                                        className={`${
                                            reserva.estado === "Activa"
                                                ? "text-green-600"
                                                : "text-red-500"
                                        } font-medium`}
                                    >
                                        {reserva.estado}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
