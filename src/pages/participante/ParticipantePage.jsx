import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ReservationCard from "../../components/ReservationCard";
import BuildingsGrid from "../../components/BuildingsGrid";
import ReservationDetailModal from "../../components/ReservationDetailModal";
import InvitacionModal from "../../components/InvitacionModal";
import ResenaModal from "../../components/ResenaModal";
import ReviewCard from "../../components/ReviewCard";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch } from "../../utils/api";
import { toast } from "react-toastify";

function formatFecha(fechaStr) {
    if (!fechaStr) return "";
    const d = new Date(fechaStr);
    if (Number.isNaN(d.getTime())) return fechaStr;
    return d.toLocaleDateString("es-UY", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function ParticipantePage() {
    const {token, user} = useAuth();
    const [tab, setTab] = useState("MIS");
    const [misReservas, setMisReservas] = useState([]);
    const [organizo, setOrganizo] = useState([]);
    const [detail, setDetail] = useState({open: false, reserva: null});
    const [invite, setInvite] = useState({open: false, id: null});

    const [pendientesResena, setPendientesResena] = useState([]);
    const [review, setReview] = useState({ open: false, reserva: null });

    const [reloadFlag, setReloadFlag] = useState(0);
    const triggerReload = () => setReloadFlag((f) => f + 1);

    useEffect(() => {
        let ignore = false;
        if (!user?.ci) return;

        const ci = Number(user.ci);
        if (!ci || isNaN(ci)) return;

        async function load() {
            try {
                const data = await apiFetch(`/reservas/cedula?ci=${ci}`, { token });
                if (ignore) return;

                const raw = Array.isArray(data) ? data : [];

                const mapped = raw
                    .filter((r) => r.estado === "Activa")
                    .map((r) => {
                        const soyOrganizador =
                            r.soyOrganizador === 1 || r.soyOrganizador === true;

                        return {
                            id_reserva: r.id_reserva,
                            sala: r.nombre_sala,
                            edificio: r.edificio,
                            fecha: formatFecha(r.fecha),
                            turno: `${r.hora_inicio}–${r.hora_fin}`,
                            participantes: r.cantidad_participantes ?? 0,
                            capacidad: r.capacidad ?? 0,
                            estado: r.estado,
                            soyOrganizador,
                            confirmacion: r.confirmacion,
                            asistencia: r.asistencia,
                            organiza: `${r.nombre_organizador} ${r.apellido_organizador}`,
                        };
                    })
                    .filter(
                        (r) =>
                            r.soyOrganizador ||
                            (r.confirmacion && r.confirmacion === "Confirmado")
                    );

                setMisReservas(mapped);
            } catch (e) {
                if (!ignore) {
                    setMisReservas([]);
                    toast.error(e.message || "No se pudieron cargar tus reservas.");

                }
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [token, user?.ci, reloadFlag]);

    useEffect(() => {
        let ignore = false;
        if (tab !== "INVITAR") return;
        if (!user?.ci) return;

        const ci = Number(user.ci);
        if (!ci || isNaN(ci)) return;

        async function load() {
            try {
                const data = await apiFetch(`/reservas/cedula?ci=${ci}`, { token });
                if (ignore) return;

                const raw = Array.isArray(data) ? data : [];

                const mapped = raw
                    .filter((r) => r.estado === "Activa")
                    .map((r) => {
                        const soyOrganizador =
                            r.soyOrganizador === 1 || r.soyOrganizador === true;

                        return {
                            id_reserva: r.id_reserva,
                            sala: r.nombre_sala,
                            edificio: r.edificio,
                            fecha: formatFecha(r.fecha),
                            turno: `${r.hora_inicio}–${r.hora_fin}`,
                            participantes: r.cantidad_participantes ?? 0,
                            capacidad: r.capacidad ?? 0,
                            estado: r.estado,
                            soyOrganizador,
                            organiza: `${r.nombre_organizador} ${r.apellido_organizador}`,
                        };
                    });

                const soloOrganizo = mapped.filter((r) => r.soyOrganizador);
                setOrganizo(soloOrganizo);
            } catch (e) {
                if (!ignore) {
                    setOrganizo([]);
                    toast.error(
                        e.message || "No se pudieron cargar las reservas que organizas."
                    );

                }
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [tab, token, user?.ci, reloadFlag]);

    useEffect(() => {
        let ignore = false;
        if (tab !== "RESENAR") return;
        if (!user?.ci) return;

        async function load() {
            try {
                const data = await apiFetch("/reservas/para-resenar", { token });
                if (!ignore) setPendientesResena(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!ignore) setPendientesResena([]);
                toast.error(e.message || "No se pudieron cargar las reservas para reseñar.");
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [tab, token, user?.ci]);

    async function handleCancel(reserva) {
        try {
            await apiFetch(`/reservas/cancelar/${reserva.id_reserva}`, {
                method: "PATCH",
                token,
            });
            setMisReservas((prev) =>
                prev.filter((r) => r.id_reserva !== reserva.id_reserva)
            );
            setOrganizo((prev) =>
                prev.filter((r) => r.id_reserva !== reserva.id_reserva)
            );
            triggerReload();
            toast.success("Reserva cancelada correctamente.");

        } catch (e) {
            toast.error(e.message || "No se pudo cancelar la reserva.");

        }
    }

    async function handleLeave(reserva) {
        try {
            await apiFetch(`/reservas/salir/${reserva.id_reserva}`, {
                method: "DELETE",
                token,
            });
            setMisReservas((prev) =>
                prev.filter((r) => r.id_reserva !== reserva.id_reserva)
            );
            triggerReload();
            toast.success("Saliste de la reserva correctamente.");

        } catch (e) {
            toast.error(e.message || "No se pudo salir de la reserva.");

        }
    }

    async function openDetail(reserva) {
        try {
            const full = await apiFetch(`/reservas/detalle/${reserva.id_reserva}`, {
                token,
            });
            const mapped = {
                sala: full.nombre_sala,
                edificio: full.edificio,
                fecha: full.fecha,
                turno: `${full.hora_inicio}–${full.hora_fin}`,
                capacidad: full.capacidad,
                estado: full.estado,
                organizador: {
                    ci: full.ci_organizador,
                    nombre: `${full.nombre_organizador} ${full.apellido_organizador}`,
                },
                participantes: full.participantes || [],
            };
            setDetail({open: true, reserva: mapped});
        } catch (e) {
            toast.error(e.message || "No se pudo cargar el detalle de la reserva.");

        }
    }

    function handleReviewSaved(reserva) {
        setPendientesResena((prev) =>
            prev.filter((r) => r.id_reserva !== reserva.id_reserva)
        );
    }


    const tabs = useMemo(
        () => [
            { key: "MIS", label: "Mis reservas" },
            { key: "HACER", label: "Hacer reserva" },
            { key: "INVITAR", label: "Invitar" },
            { key: "RESENAR", label: "Reseñar" },
        ],
        []
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onInvitationsChanged={triggerReload} />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="mb-6 flex flex-wrap gap-2">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={[
                                    "rounded-full border px-4 py-2 text-sm font-semibold",
                                    tab === t.key
                                        ? "border-blue-700 bg-blue-700 text-white"
                                        : "border-blue-700 text-blue-700 hover:bg-blue-50",
                                ].join(" ")}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === "MIS" && (
                        <div className="grid gap-3">
                            {misReservas.map((r) => (
                                <ReservationCard
                                    key={r.id_reserva}
                                    reserva={r}
                                    isOrganizer={r.soyOrganizador}
                                    onView={() => openDetail(r)}
                                    onCancel={handleCancel}
                                    onLeave={handleLeave}
                                    onInvite={() => setInvite({ open: true, id: r.id_reserva })}
                                />
                            ))}
                            {misReservas.length === 0 && (
                                <div className="text-sm text-slate-600">
                                    No tienes reservas por ahora.
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "HACER" && <BuildingsGrid onReservaCreada={triggerReload} />}

                    {tab === "INVITAR" && (
                        <div className="grid gap-3">
                            {organizo.map((r) => (
                                <ReservationCard
                                    key={r.id_reserva}
                                    reserva={r}
                                    isOrganizer
                                    showCancel={false}
                                    onView={() => openDetail(r)}
                                    onCancel={handleCancel}
                                    onInvite={() => setInvite({ open: true, id: r.id_reserva })}
                                />
                            ))}
                            {organizo.length === 0 && (
                                <div className="text-sm text-slate-600">
                                    No organizas reservas todavía.
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "RESENAR" && (
                        <div className="grid gap-3">
                            {pendientesResena.map((r) => (
                                <ReviewCard
                                    key={r.id_reserva}
                                    reserva={r}
                                    onReview={(res) =>
                                        setReview({ open: true, reserva: res })}
                                />
                            ))}
                            {pendientesResena.length === 0 && (
                                <div className="text-sm text-slate-600">
                                    No tienes reservas pendientes de reseña.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <ReservationDetailModal
                open={detail.open}
                onClose={() => setDetail({ open: false, reserva: null })}
                reserva={detail.reserva}
            />

            <InvitacionModal
                open={invite.open}
                onClose={() => setInvite({ open: false, id: null })}
                reservaId={invite.id}
                token={token}
                onSaved={triggerReload}
            />

            <ResenaModal
                open={review.open}
                onClose={() => setReview({ open: false, reserva: null })}
                reserva={review.reserva}
                token={token}
                onSaved={handleReviewSaved}
            />
        </div>
    );
}