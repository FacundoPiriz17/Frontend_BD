import { useAuth } from "../../contexts/AuthContext";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import NavButton from "../../components/NavButton.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function AdminPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 bg-gradient-to-b from-slate-200 to-blue-100">
                <SidebarAdmin />
                <main className="flex-1 flex justify-center items-center overflow-auto px-4 py-10">
                    <div className="w-full max-w-5xl mx-auto">
                    <header className="mb-6 text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
                                Bienvenido, {user?.nombre}
                            </h2>
                            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                                Desde aquí podrás gestionar usuarios, roles, reservas, reseñas y
                                estadísticas del sistema.
                            </p>
                        </header>

                        <section>
                            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3 text-center">
                                Panel de administración
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-4 justify-center max-w-3xl mx-auto">
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                                    <NavButton
                                        href="/stats"
                                        name="Estadísticas"
                                    />
                                </div>
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                                    <NavButton
                                        href="/reservas"
                                        name="Reservas"
                                    />
                                </div>
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                                    <NavButton
                                        href="/salas"
                                        name="Salas"
                                    />
                                </div>
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                                    <NavButton
                                        href="/sanciones"
                                        name="Sanciones"
                                    />
                                </div>
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                                    <NavButton
                                        href="/reseñas"
                                        name="Reseñas"
                                    />
                                </div>
                                <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                                    <NavButton
                                        href="/usuarios"
                                        name="Usuarios"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}