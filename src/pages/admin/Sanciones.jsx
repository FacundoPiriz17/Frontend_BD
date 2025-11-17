import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ucuRoomsLogo from "../../assets/ucurooms_White.png";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";
import ModalEliminarSancion from "../../components/ModalEliminarSancion.jsx";
import ModalEditarSancion from "../../components/ModalEditarSancion.jsx";

export default function SancionesPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sanciones, setSanciones] = useState([]);
    const { token } = useAuth();

    const [modalEliminar, setModalEliminar] = useState({ open: false, id: null });
    const [modalEditar, setModalEditar] = useState({ open: false, sancion: null });

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const data = await apiFetch("/sanciones/all", { token });
                if (!ignore) setSanciones(data ?? []);
            } catch (err) {
                console.error("Fallo /sanciones/all:", err);
                if (!ignore) setSanciones([]);
            }
        }

        load();
        return () => (ignore = true);
    }, [token]);

    function handleOpenEliminar(id) {
        setModalEliminar({ open: true, id });
    }

    function handleOpenEditar(sancion) {
        setModalEditar({ open: true, sancion });
    }
    function handleOpenAniadir() {
        setModalEditar({ open: true, sancion: null });
    }


    async function refresh() {
        const data = await apiFetch("/sanciones/all", { token });
        setSanciones(data ?? []);
    }

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
                    className="text-green-800 bg-[#fcfaee] hover:bg-[#fcfaee]/90 px-4 py-2 rounded transition"
                >
                    Cerrar sesión
                </button>
            </nav>

            <div className="flex flex-1 h-full">

                <SidebarAdmin />

                <div className="flex-1 overflow-auto py-8 px-4">
                    <main className="max-w-3xl mx-auto w-full">

                        {/* Título y botón Añadir */}
                        <div className="flex justify-between items-center px-4 mb-6">
                            <h2 className="text-3xl font-bold text-green-800">Gestión de Sanciones</h2>

                            <button
                                onClick={handleOpenAniadir}
                                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 shadow"
                            >
                                Añadir sanción
                            </button>
                        </div>

                        {/* Mapea y muestra cada sanción */}
                        <div className="flex flex-col gap-4 px-4">
                            {sanciones.map((s) => (
                                <div
                                    key={s.id_sancion}
                                    className="bg-white shadow-md rounded-xl p-5 w-full flex justify-between items-center border border-gray-200"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-green-800">
                                            CI: {s.ci_participante}
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            <span className="font-semibold">Motivo:</span> {s.motivo}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">Inicio:</span> {s.fecha_inicio}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">Fin:</span> {s.fecha_fin}
                                        </p>
                                    </div>

                                    {/*Botones de eliminar y editar */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenEditar(s)}
                                            className="px-4 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleOpenEliminar(s.id_sancion)}
                                            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {sanciones.length === 0 && (
                                <div className="text-gray-600 text-sm">No hay sanciones registradas.</div>
                            )}
                        </div>


                        {/* Modales */}
                        <ModalEliminarSancion
                            open={modalEliminar.open}
                            onClose={() => setModalEliminar({ open: false, id: null })}
                            sancionId={modalEliminar.id}
                            token={token}
                            onConfirm={async () => {
                                await refresh();
                            }}
                        />

                        <ModalEditarSancion
                            open={modalEditar.open}
                            onClose={() => setModalEditar({ open: false, sancion: null })}
                            sancion={modalEditar.sancion}
                            token={token}
                            onConfirm={async () => {
                                await refresh();
                            }}
                            titulo={modalEditar.sancion ? "Editar sanción" : "Añadir sanción"}
                        />
                    </main>
                </div>
            </div>

            <nav className="flex justify-between items-center bg-green-800 shadow-md px-6 py-4">
                <h1 className="text-xl font-semibold text-[#fcfaee]">UCU</h1>
            </nav>

        </div>
    );
}




