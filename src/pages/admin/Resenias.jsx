import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ucuRoomsLogo from "../../assets/ucurooms_White.png";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";

import ModalEditarResena from "../../components/ModalEditarResenia.jsx";
import ModalEliminar from "../../components/ModalEliminar.jsx";
import Navbar from "../../components/Navbar.jsx";

export default function ReseniasPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [resenias, setResenias] = useState([]);

    const [modalEliminar, setModalEliminar] = useState({ open: false, id: null });
    const [modalEditar, setModalEditar] = useState({ open: false, resena: null });

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Cargar reseñas
    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const data = await apiFetch("/resenas/all", { token });
                if (!ignore) setResenias(data ?? []);
            } catch (err) {
                console.error("Fallo /resenas/all:", err);
                if (!ignore) setResenias([]);
            }
        }

        load();
        return () => (ignore = true);
    }, [token]);

    function handleOpenEliminar(id) {
        setModalEliminar({ open: true, id });
    }

    function handleOpenEditar(resena) {
        setModalEditar({ open: true, resena });
    }

    async function refresh() {
        const data = await apiFetch("/resenas/all", { token });
        setResenias(data ?? []);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col">

            {/* NAV SUPERIOR */}
            <Navbar/>

            <div className="flex flex-1 h-full">
                <SidebarAdmin />

                <div className="flex-1 overflow-auto py-8 px-4">
                    <main className="max-w-3xl mx-auto w-full">

                        {/* Título y botón */}
                        <div className="flex justify-between items-center px-4 mb-6">
                            <h2 className="text-3xl font-bold text-green-800">Gestión de Reseñas</h2>

                        </div>

                        {/* LISTADO */}
                        <div className="flex flex-col gap-4 px-4">
                            {resenias.map((r) => (
                                <div
                                    key={r.id_resena}
                                    className="bg-white shadow-md rounded-xl p-5 w-full flex justify-between items-center border border-gray-200"
                                >
                                    <div className="space-y-1">

                                        <h3 className="text-2xl font-bold text-green-800">
                                            {r.nombre_sala}
                                        </h3>

                                        <h3 className="text-xl font-semibold text-green-800">
                                            {r.nombre_completo} ({r.ci_participante})
                                        </h3>

                                        {/* Estrellas */}
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={
                                                        i < r.puntaje_general
                                                            ? "text-yellow-500 text-xl"
                                                            : "text-gray-300 text-xl"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-gray-700 -mt-1 mb-2">
                                            <span className="font-semibold">Edificio:</span> {r.edificio}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">ID_Reserva: </span> #{r.id_reserva}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">Fecha:</span> {r.fecha_publicacion}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">Descripción:</span> {r.descripcion}
                                        </p>

                                    </div>
                                    <div className="flex flex-col gap-7">
                                        <button
                                            onClick={() => handleOpenEditar(r)}
                                            className="px-4 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleOpenEliminar(r.id_resena)}
                                            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                </div>
                            ))}

                            {resenias.length === 0 && (
                                <div className="text-gray-600 text-sm">No hay reseñas registradas.</div>
                            )}
                        </div>

                        {/* MODALES */}
                        <ModalEliminar
                            open={modalEliminar.open}
                            onClose={() => setModalEliminar({ open: false, id: null })}
                            objeto="esta reseña"
                            onConfirm={async () => {
                                await apiFetch(`/resenas/eliminar/${modalEliminar.id}`, {
                                    method: "DELETE",
                                    token,
                                });
                                await refresh();
                            }}
                        />

                        <ModalEditarResena
                            open={modalEditar.open}
                            onClose={() => setModalEditar({ open: false, resena: null })}
                            resena={modalEditar.resena}
                            token={token}
                            onConfirm={async () => refresh()}
                        />

                    </main>
                </div>
            </div>

            {/* FOOTER */}
            <nav className="flex justify-between items-center bg-green-800 shadow-md px-6 py-4">
                <h1 className="text-xl font-semibold text-[#fcfaee]">UCU</h1>
            </nav>
        </div>
    );
}
