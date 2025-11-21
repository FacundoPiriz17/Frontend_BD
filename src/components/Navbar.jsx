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

  const navBgClass = useMemo(() => {
    switch (role) {
      case "Administrador":
        return "bg-blue-900";
      case "Funcionario":
        return "bg-blue-900";
      case "Participante":
      default:
        return "bg-[#0b1743]";
    }
  }, [role]);

  const uiColors = useMemo(() => {
    switch (role) {
      case "Administrador":
        return {
          hover: "hover:bg-green-700/40",
          ring: "focus:ring-green-400",
        };
      case "Funcionario":
        return {
          hover: "hover:bg-yellow-600/30",
          ring: "focus:ring-yellow-400",
        };
      case "Participante":
      default:
        return {
          hover: "hover:bg-white/10",
          ring: "focus:ring-blue-500",
        };
    }
  }, [role]);

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

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-slate-200 ${navBgClass}`}
    >
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
                  className={`relative rounded-full p-2 ${uiColors.hover} focus:outline-none ${uiColors.ring}`}
                >
                  <FaBell className="text-white" />

                  {pendingCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
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
              className={`group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white ${uiColors.hover} focus:outline-none ${uiColors.ring}`}
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
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/perfil");
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  Mi perfil
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout?.();
                    navigate("/login");
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
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
