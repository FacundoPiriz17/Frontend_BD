import { useAuth } from "../../contexts/AuthContext";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import NavButton from "../../components/NavButton.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 h-full">
        <SidebarAdmin />
        <div className="flex-1 overflow-auto py-8 px-4">
          <main className="flex flex-col items-center justify-center h-[80vh] text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-3">
              Bienvenido, {user?.nombre}
            </h2>
            <p className="text-gray-600 text-lg">
              Desde aquí podrás gestionar usuarios, roles y datos del sistema.
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
