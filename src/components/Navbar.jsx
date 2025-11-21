import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import NotificationsDropdown from "./NotificationsDropdown";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../utils/api";
import ucuRoomsLogo from "../assets/ucurooms_White.png";
import { toast } from "react-toastify";

export default function Navbar({ onInvitationsChanged = () => {} }) {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const role = user?.rol;

    const pendingCount = useMemo(() => items.length, [items]);

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                setLoading(true);
                const data = await apiFetch("/reservas/invitaciones?estado=pendiente", {
                    token,
                });
                if (!ignore) setItems(Array.isArray(data) ? data : []);
            } catch {
                if (!ignore) setItems([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        if (token && role === "Participante") load();
        else setItems([]);

        return () => {
            ignore = true;
        };
    }, [token, role]);

    async function handleConfirm(n, estado) {
        try {
            await apiFetch(`/reservas/confirmacion/${n.reservaId}`, {
                method: "PATCH",
                token,
                body: { confirmacion: estado },
            });
            setItems((prev) => prev.filter((x) => x.id !== n.id));
            onInvitationsChanged();
            toast.success(
                estado === "Confirmado"
                    ? "Invitación aceptada."
                    : "Invitación rechazada."
            );
        } catch (e) {
            toast.error(e.message || "No se pudo actualizar la invitación.");
        }
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-40 w-full bg-[#0b1743]">
            <div className="mx-auto max-w-7xl px-4 py-3">
                <div className="flex items-center justify-between">
                    <img
                        src={ucuRoomsLogo}
                        alt="Logo de Ucu Rooms"
                        className="h-12 w-12 rounded-xl"
                    />

                    <div className="flex items-center gap-4 relative">
                        {role === "Participante" && (
                            <>
                                <button
                                    onClick={() => {
                                        setNotifOpen((v) => !v);
                                        setProfileOpen(false);
                                    }}
                                    className="relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus:ring-blue-500"
                                >
                                    <FaBell className="text-white" />

                                    {pendingCount > 0 && (
                                        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                                    )}
                                </button>

                                <div className="relative">
                                    <NotificationsDropdown
                                        open={notifOpen}
                                        onClose={() => setNotifOpen(false)}
                                        items={items}
                                        loading={loading}
                                        onAccept={(n) => handleConfirm(n, "Confirmado")}
                                        onReject={(n) => handleConfirm(n, "Rechazado")}
                                    />
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => {
                                setProfileOpen((v) => !v);
                                setNotifOpen(false);
                            }}
                            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-blue-500"
                        >
                            <CgProfile size={18} />
                            <div className="flex flex-col items-start max-w-[180px]">
                                <span className="truncate">{user?.nombre ?? "Usuario"}</span>
                                <span className="text-xs text-slate-300 truncate">
                  {role ?? ""}
                </span>
                            </div>
                            <span className="opacity-70 group-hover:opacity-100">▾</span>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-12 w-40 rounded-xl bg-white shadow-lg border border-slate-200 py-2 text-sm">
                                <button
                                    onClick={() => navigate("/perfil")}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                >
                                    Ver perfil
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}