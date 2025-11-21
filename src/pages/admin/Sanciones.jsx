import { useAuth } from "../../contexts/AuthContext";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";
import ModalEliminarSancion from "../../components/ModalEliminar.jsx";
import ModalEditarSancion from "../../components/ModalEditarSancion.jsx";
import ModalEliminar from "../../components/ModalEliminar.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function SancionesPage() {
    const [sanciones, setSanciones] = useState([]);
    const { token } = useAuth();

    const [modalEliminar, setModalEliminar] = useState({ open: false, id: null });
    const [modalEditar, setModalEditar] = useState({ open: false, sancion: null });

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

            <Navbar/>

            <div className="flex flex-1 h-full">

                <SidebarAdmin />

                <div className="flex-1 overflow-auto py-8 px-4">
                    <main className="max-w-3xl mx-auto w-full">

                        <div className="flex justify-between items-center px-4 mb-6">
                            <h2 className="text-3xl font-bold text-blue-800">Gestión de Sanciones</h2>

                            <button
                                onClick={handleOpenAniadir}
                                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 shadow"
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
                                        <h3 className="text-xl font-semibold text-blue-800">
                                            Nombre: {s.nombre_completo ?? "Desconocido"}
                                        </h3>

                                        <p className="text-gray-700 -mt-1 mb-2">
                                            <span className="font-semibold">CI: {s.ci_participante}</span>
                                        </p>

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

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenEditar(s)}
                                            className="px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleOpenEliminar(s.id_sancion)}
                                            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
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
                        <ModalEliminar
                            open={modalEliminar.open}
                            onClose={() => setModalEliminar({ open: false, id: null })}
                            objeto="esta sanción"
                            onConfirm={async () => {
                                await apiFetch(`/sanciones/eliminar/${modalEliminar.id}`, {
                                    method: "DELETE",
                                    token,
                                });
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

            <Footer/>

        </div>
    );
}




