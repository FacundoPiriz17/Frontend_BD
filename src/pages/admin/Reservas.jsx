import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ucuRoomsLogo from "../../assets/ucurooms_White.png";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import { apiFetch } from "../../utils/api.js";
import ReservationCard from "../../components/ReservationCard.jsx";
import ReservationDetailModal from "../../components/ReservationDetailModal.jsx";
import ReservaModal from "../../components/ReservaModal.jsx";
import ModalEliminar from "../../components/ModalEliminar.jsx";

export default function ReservasPage() {
    const { logout, token } = useAuth();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);

    const [modalVer, setModalVer] = useState({ open: false, reserva: null });
    const [modalEditar, setModalEditar] = useState({ open: false, reserva: null });
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState({ open: false, id: null });

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    async function fetchAllAndDetalle() {
        try {
            const list = await apiFetch("/reservas/all", { token });
            if (!Array.isArray(list)) {
                setReservas([]);
                return;
            }
            // Enriquecer cada reserva pidiendo /reservas/detalle/:id
            const detalles = await Promise.all(
                list.map(async (r) => {
                    try {
                        const det = await apiFetch(`/reservas/detalle/${r.id_reserva}`, { token });
                        // normalizar estructura para ReservationCard y modales
                        return {
                            ...r,
                            id_reserva: r.id_reserva,
                            nombre_sala: det.nombre_sala,
                            sala: det.nombre_sala,
                            edificio: det.edificio,
                            fecha: typeof det.fecha === "string" ? det.fecha : String(det.fecha).slice(0,10),
                            id_turno: det.id_turno,
                            turno: `${det.hora_inicio} · ${det.hora_fin}`,
                            estado: det.estado,
                            organizador: {
                                ci: det.ci_organizador,
                                nombre: det.nombre_organizador,
                                apellido: det.apellido_organizador,
                            },
                            participantes: Array.isArray(det.participantes) ? det.participantes.length : 0,
                            capacidad: det.capacidad ?? 0,
                            detalle_full: det,
                        };
                    } catch (e) {
                        // si falla detalle, devolvemos versión básica
                        return {
                            ...r,
                            id_reserva: r.id_reserva,
                            sala: r.nombre_sala,
                            edificio: r.edificio,
                            fecha: r.fecha ? String(r.fecha).slice(0,10) : "",
                            turno: r.id_turno,
                            organizador: { ci: r.ci_organizador },
                            participantes: 0,
                            capacidad: 0,
                            detalle_full: null,
                        };
                    }
                })
            );
            setReservas(detalles);
        } catch (err) {
            console.error("Error cargando reservas:", err);
            setReservas([]);
        }
    }

    useEffect(() => {
        fetchAllAndDetalle();
    }, [token]);

    async function refresh() {
        await fetchAllAndDetalle();
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col">
            <nav className="flex justify-between items-center bg-green-800 shadow-md px-6 py-4">
                <div className="flex items-center space-x-3">
                    <img src={ucuRoomsLogo} alt="UCU Rooms" className="w-15 h-15 mr-20" />
                    <h1 className="text-xl font-semibold text-[#fcfaee]">Panel del Administrador</h1>
                </div>
                <button onClick={handleLogout} className="text-green-800 bg-[#fcfaee] px-4 py-2 rounded">Cerrar sesión</button>
            </nav>

            <div className="flex flex-1 h-full">
                <SidebarAdmin />

                <div className="flex-1 overflow-auto py-8 px-4">
                    <main className="max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-center px-4 mb-6">
                            <h2 className="text-3xl font-bold text-green-800">Gestión de Reservas</h2>
                            <button onClick={() => setModalAgregar(true)} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 shadow">Añadir reserva</button>
                        </div>

                        <div className="flex flex-col gap-4 px-4">
                            {reservas.length === 0 && <div className="text-gray-600 text-sm">No hay reservas registradas.</div>}
                            {reservas.map((r) => (
                                <ReservationCard
                                    key={r.id_reserva}
                                    reserva={r}
                                    isAdmin={true}
                                    isOrganizer={false}
                                    onView={(res) => setModalVer({ open: true, reserva: res })}
                                    onEdit={(res) => setModalEditar({ open: true, reserva: res })}
                                    onDelete={(res) => setModalEliminar({ open: true, id: res.id_reserva })}
                                />
                            ))}
                        </div>

                        <ReservationDetailModal
                            open={modalVer.open}
                            onClose={() => setModalVer({ open: false, reserva: null })}
                            reserva={modalVer.reserva?.detalle_full ?? modalVer.reserva}
                        />

                        <ReservaModal
                            open={modalAgregar}
                            onClose={() => setModalAgregar(false)}
                            token={token}
                            modo="agregar"
                            isAdmin={true}
                            onConfirm={async () => {
                                setModalAgregar(false);
                                await refresh();
                            }}
                        />

                        <ReservaModal
                            open={modalEditar.open}
                            onClose={() => setModalEditar({ open: false, reserva: null })}
                            reserva={modalEditar.reserva?.detalle_full ?? modalEditar.reserva}
                            token={token}
                            modo="editar"
                            isAdmin={true}
                            onConfirm={async () => {
                                setModalEditar({ open: false, reserva: null });
                                await refresh();
                            }}
                        />

                        <ModalEliminar
                            open={modalEliminar.open}
                            onClose={() => setModalEliminar({ open: false, id: null })}
                            objeto="esta reserva"
                            onConfirm={async () => {
                                console.log("ID que se intenta eliminar:", modalEliminar.id);

                                try {
                                    await apiFetch(`/reservas/eliminar/${modalEliminar.id}`, { method: "DELETE", token });
                                } catch (e) {
                                    console.error("Error eliminando reserva:", e);
                                }
                                setModalEliminar({ open: false, id: null });
                                await refresh();
                            }}
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
