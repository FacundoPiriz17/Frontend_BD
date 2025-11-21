import { useAuth } from "../../contexts/AuthContext";

import Navbar from "../../components/Navbar";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import Footer from "../../components/Footer.jsx";
import NavButton from "../../components/NavButton.jsx";

export default function FuncionarioPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Navbar />
      <div className="flex flex-1 h-full">
        <SidebarAdmin />
        <div className="flex-1 overflow-auto py-8 px-4">
          <main className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-3">
              Bienvenido, {user?.nombre}
            </h2>
            <p className="text-gray-600 text-lg">
              Desde aquí podrás administrar las salas y verificar reservas.
            </p>

            <div className="m-6 bg-white p-4 rounded-xl shadow-md w-full max-w-lg grid grid-cols-2 gap-1 ">
              <NavButton href={"/stats"} name={"Estadisticas"} />
              <NavButton href={"/sanciones"} name={"Sanciones"} />
              <NavButton href={"/reseñas"} name={"Reseñas"} />
              <NavButton href={"/usuarios"} name={"Usuarios"} />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
