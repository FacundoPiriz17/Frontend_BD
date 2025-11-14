import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ReservationCard from "../../components/ReservationCard";
import BuildingsGrid from "../../components/BuildingsGrid";
import ReservationDetailModal from "../../components/ReservationDetailModal";
import InvitacionModal from "../../components/InvitacionModal";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch } from "../../utils/api";

export default function ParticipantePage() {
    const {token, user} = useAuth();
    const [tab, setTab] = useState("MIS");
    const [misReservas, setMisReservas] = useState([]);
    const [organizo, setOrganizo] = useState([]);
    const [detail, setDetail] = useState({open: false, reserva: null});
    const [invite, setInvite] = useState({open: false, id: null});

    useEffect(() => {
        let ignore = false;
        if (!user?.ci) return;

        const ci = Number(user.ci);
        if (!ci || isNaN(ci)) return;

        async function load() {
            try {
                const data = await apiFetch(`/reservas/cedula?ci=${ci}`, { token });
                if (!ignore) setMisReservas(Array.isArray(data) ? data : []);
            } catch {
                if (!ignore) setMisReservas([]);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [token, user?.ci]);

    useEffect(() => {
        let ignore = false;
        if (tab !== "INVITAR") return;
        if (!user?.ci) return;

        const ci = Number(user.ci);
        if (!ci || isNaN(ci)) return;

        async function load() {
            try {
                const data = await apiFetch(`/reservas/cedula?ci=${ci}`, { token });
                if (!ignore) {
                    const soloOrganizo = (Array.isArray(data) ? data : []).filter(
                        (r) => r.soyOrganizador === 1 || r.soyOrganizador === true
                    );
                    setOrganizo(soloOrganizo);
                }
            } catch {
                if (!ignore) setOrganizo([]);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [tab, token, user?.ci]);

    async function handleCancel(reserva) {
        await apiFetch(`/reservas/cancelar/${reserva.id_reserva}`, {
            method: "PATCH",
            token,
        });
        setMisReservas((prev) => prev.filter((r) => r.id_reserva !== reserva.id_reserva));
        setOrganizo((prev) => prev.filter((r) => r.id_reserva !== reserva.id_reserva));
    }

    async function handleLeave(reserva) {
        await apiFetch(`/reservas/salir/${reserva.id_reserva}`, {
            method: "DELETE",
            token,
        });
        setMisReservas((prev) => prev.filter((r) => r.id_reserva !== reserva.id_reserva));
    }


    async function openDetail(reserva) {
        const full = await apiFetch(`/reservas/${reserva.id_reserva}`, { token });
        setDetail({ open: true, reserva: full });
        setDetail({ open: true, reserva });
    }

    const tabs = useMemo(
        () => [
            { key: "MIS", label: "Mis reservas" },
            { key: "HACER", label: "Hacer reserva" },
            { key: "INVITAR", label: "Invitar" },
        ],
        []
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
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
                                ].join(" ")}
                            >
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

                    {tab === "HACER" && <BuildingsGrid />}

                    {tab === "INVITAR" && (
                        <div className="grid gap-3">
                            {organizo.map((r) => (
                                <ReservationCard
                                    key={r.id_reserva}
                                    reserva={r}
                                    isOrganizer
                                    onView={() => {}}
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
                onSaved={() => {}}
            />
        </div>
    );
}
