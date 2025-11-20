import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import Footer from "../../components/Footer.jsx";

export default function FuncionarioPage() {

    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
            <Navbar/>
            <div className="flex flex-1 h-full">
                <SidebarAdmin />
            </div>
            <main className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
                <h2 className="text-3xl font-bold text-blue-900 mb-3">
                    Bienvenido, {user?.nombre}
                </h2>
                <p className="text-gray-600 text-lg">
                    Desde aquí podrás administrar las salas y verificar reservas.
                </p>

                <div className="mt-8 bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
                    <p className="text-gray-500 text-center italic">
                        (Próximamente panel de gestión de salas)
                    </p>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
