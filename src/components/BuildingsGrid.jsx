import { useEffect, useMemo, useState } from "react";
import BuildingCard from "./BuildingCard";
import ReservaModal from "./ReservaModal";
import EdificioInfoModal from "./EdificioInfoModal";
import edificiosImg from "../assets/edificios.json";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../utils/api";
import uculogo from "../assets/ucurooms.png";
import InvitacionModal from "./InvitacionModal.jsx";

export default function BuildingsGrid() {
    const { token } = useAuth();
    const [edificios, setEdificios] = useState([]);
    const [campus, setCampus] = useState("Todos");
    const [modalReserva, setModalReserva] = useState({ open: false, edificio: "" });
    const [modalInfo, setModalInfo] = useState({ open: false, edificio: "" });
    const [modalInvitacion, setModalInvitacion] = useState({ open: false, reservaId: null });

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const data = await apiFetch("/edificios/todos", { token });
                const withImg = (data ?? []).map((e) => {
                    const img = edificiosImg.find(
                        (x) => x.nombre_edificio === e.nombre_edificio
                    );
                    return { ...e, imageUrl: img?.imageUrl ?? uculogo };
                });
                if (!ignore) setEdificios(withImg);
            } catch (err) {
                if (!ignore) setEdificios([]);
                console.error("Fallo /edificios/todos:", err);
                if (!ignore) setEdificios([]);
            }
        }
        load();
        return () => { ignore = true; };
    }, [token]);

    const campuses = useMemo(() => {
        const set = new Set(edificios.map((e) => e.campus).filter(Boolean));
        return ["Todos", ...Array.from(set)];
    }, [edificios]);

    const filtered = useMemo(() => {
        if (campus === "Todos") return edificios;
        return edificios.filter((e) => e.campus === campus);
    }, [edificios, campus]);

    async function handleConfirmReserva(payload) {
        const reserva = await apiFetch("/reservas/registrar", {
            method: "POST",
            token,
            body: {
                edificio: payload.edificio,
                nombre_sala: payload.sala,
                fecha: payload.fecha,
                id_turno: payload.turno,
            },
        });
        setModalReserva({ open: false, edificio: "" });
        if (reserva?.id_reserva) {
            setModalInvitacion({open: true, reservaId: reserva.id_reserva});
        }
        return reserva;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {campuses.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCampus(c)}
                        className={[
                            "rounded-full border px-3 py-1.5 text-sm",
                            c === campus
                                ? "border-blue-700 bg-blue-700 text-white"
                                : "border-blue-700 text-blue-700 hover:bg-blue-50",
                        ].join(" ")}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((e) => (
                    <BuildingCard
                        key={e.nombre_edificio}
                        nombre={e.nombre_edificio}
                        direccion={e.direccion}
                        imageUrl={e.imageUrl}
                        onReservar={() => setModalReserva({ open: true, edificio: e.nombre_edificio })}
                        onInfo={() => setModalInfo({ open: true, edificio: e.nombre_edificio })}
                    />
                ))}
                {filtered.length === 0 && (
                    <div className="text-sm text-slate-600">No hay edificios para el filtro seleccionado.</div>
                )}
            </div>

            <ReservaModal
                open={modalReserva.open}
                onClose={() => setModalReserva({ open: false, edificio: "" })}
                edificio={modalReserva.edificio}
                token={token}
                onConfirm={handleConfirmReserva}
            />
            <EdificioInfoModal
                open={modalInfo.open}
                onClose={() => setModalInfo({ open: false, edificio: "" })}
                edificio={modalInfo.edificio}
                token={token}
            />
            <InvitacionModal
                open={modalInvitacion.open}
                onClose={() => setModalInvitacion({ open: false, reservaId: null })}
                reservaId={modalInvitacion.reservaId}
                token={token}
                onSaved={() => {}}
            />
        </div>
    );
}
