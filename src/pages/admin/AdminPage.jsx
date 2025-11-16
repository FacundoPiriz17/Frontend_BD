import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ucuRoomsLogo from "../../assets/ucurooms_White.png";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import ResumenSalas from "../../components/ResumenSalas.jsx";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col">
      <nav className="flex justify-between items-center bg-green-800 shadow-md px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src={ucuRoomsLogo} alt="UCU Rooms" className="w-15 h-15 mr-20" />
          <h1 className="text-xl font-semibold text-[#fcfaee]">
            Panel del Administrador
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-green-800 bg-[#fcfaee] hover:bg-[#fcfaee]-200 px-4 py-2 rounded transition"
        >
          Cerrar sesión
        </button>
      </nav>

      <div className="flex flex-1 h-full">
        <SidebarAdmin />
        <div className="flex-1 overflow-auto py-8 px-4">
          <main className="flex flex-col items-center justify-center h-[80vh] text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-3">
              Bienvenido, {user?.nombre}
            </h2>
            <p className="text-gray-600 text-lg">
              Desde aquí podrás gestionar usuarios, roles y datos del sistema.
            </p>

            <div>
              <ResumenSalas />
            </div>
          </main>
        </div>
      </div>
      <nav className="flex justify-between items-center bg-green-800 shadow-md px-6 py-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-blue-400">UCU</h1>
        </div>
      </nav>
    </div>
  );
}
