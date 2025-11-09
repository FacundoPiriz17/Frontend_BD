import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ucuroomslogo from "../assets/ucurooms_White.png"

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="flex items-center justify-between bg-white/70 backdrop-blur-md shadow-md px-6 py-3">
            <div className="flex items-center space-x-3">
                <img
                    src={ucuroomslogo}
                    alt="Logo"
                    className="w-10 h-10 rounded-full"
                />
                <h1 className="text-xl font-semibold text-blue-800">
                    Plataforma de Reservas
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                {user?.rol === "Participante" && (
                    <>
                        <button
                            onClick={() => navigate("/participante")}
                            className="text-blue-800 hover:text-blue-600 transition"
                        >
                            Mis Reservas
                        </button>
                    </>
                )}

                {user?.rol === "Funcionario" && (
                    <>
                        <button
                            onClick={() => navigate("/funcionario")}
                            className="text-blue-800 hover:text-blue-600 transition"
                        >
                            Gestión de Salas
                        </button>
                    </>
                )}

                {user?.rol === "Admin" && (
                    <>
                        <button
                            onClick={() => navigate("/admin")}
                            className="text-blue-800 hover:text-blue-600 transition"
                        >
                            Panel de Control
                        </button>
                        <button
                            onClick={() => navigate("/usuarios")}
                            className="text-blue-800 hover:text-blue-600 transition"
                        >
                            Usuarios
                        </button>
                    </>
                )}

                {/* Info del usuario */}
                <span className="text-gray-700 text-sm">
          {user?.nombre} ({user?.rol})
        </span>

                <button
                    onClick={handleLogout}
                    className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}
