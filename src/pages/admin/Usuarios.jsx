import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";
import ModalEliminar from "../../components/ModalEliminar.jsx";
import ModalEditarUsuario from "../../components/ModalEditarUsuario.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function UsuariosPage() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);

    const [modalEliminar, setModalEliminar] = useState({ open: false, ci: null });
    const [modalEditar, setModalEditar] = useState({ open: false, usuario: null });

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const data = await apiFetch("/login/usuarios", { token });
                if (!ignore) setUsuarios(data ?? []);
            } catch (err) {
                console.error("Fallo /login/usuarios:", err);
                if (!ignore) setUsuarios([]);
            }
        }

        load();
        return () => (ignore = true);
    }, [token]);

    function handleOpenEliminar(ci) {
        setModalEliminar({ open: true, ci });
    }

    function handleOpenEditar(usuario) {
        setModalEditar({ open: true, usuario });
    }


    async function refresh() {
        const data = await apiFetch("/login/usuarios", { token });
        setUsuarios(data ?? []);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col">

            <Navbar/>

            <div className="flex flex-1 h-full">

                <SidebarAdmin />

                <div className="flex-1 overflow-auto py-8 px-4">
                    <main className="max-w-3xl mx-auto w-full">

                        <div className="flex justify-between items-center px-4 mb-6">
                            <h2 className="text-3xl font-bold text-blue-800">Gestión de Usuarios</h2>

                            <button
                                onClick={() => navigate("/registro")}
                                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 shadow"
                            >
                                Añadir usuario
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 px-4">
                            {usuarios.map((u) => (
                                <div
                                    key={u.ci}
                                    className="bg-white shadow-md rounded-xl p-5 w-full flex justify-between items-center border border-gray-200"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-800">
                                            {u.nombre} {u.apellido}
                                        </h3>

                                        <p className="text-gray-700 -mt-1 mb-2">
                                            <span className="font-semibold">CI:</span> {u.ci}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">Email:</span> {u.email}
                                        </p>

                                        <p className="text-gray-600">
                                            <span className="font-semibold">Rol:</span> {u.rol}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenEditar(u)}
                                            className="px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleOpenEliminar(u.ci)}
                                            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {usuarios.length === 0 && (
                                <div className="text-gray-600 text-sm">No hay usuarios registrados.</div>
                            )}
                        </div>

                        <ModalEliminar
                            open={modalEliminar.open}
                            onClose={() => setModalEliminar({ open: false, ci: null })}
                            objeto="este usuario"
                            onConfirm={async () => {
                                await apiFetch(`/login/usuarios/${modalEliminar.ci}`, {
                                    method: "DELETE",
                                    token,
                                });
                                await refresh();
                            }}
                        />

                        <ModalEditarUsuario
                            open={modalEditar.open}
                            onClose={() => setModalEditar({ open: false, usuario: null })}
                            usuario={modalEditar.usuario}
                            token={token}
                            onConfirm={async () => {
                                await refresh();
                            }}
                            titulo={modalEditar.usuario ? "Editar usuario" : "Añadir usuario"}
                        />
                    </main>
                </div>
            </div>

            <Footer/>

        </div>
    );
}
