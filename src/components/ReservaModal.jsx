import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../utils/api.js";
import { useAuth } from "../contexts/AuthContext";

export default function ReservaModal({ open, onClose, edificio, token, onConfirm }) {
    const { user } = useAuth();

    const [salas, setSalas] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [form, setForm] = useState({ sala: "", fecha: "", turno: "" });
    const [loading, setLoading] = useState(false);

    const [programas, setProgramas] = useState([]);

    useEffect(() => {
        if (!open) return;

        async function loadSalas() {
            try {
                const data = await apiFetch(
                    `/salas/${encodeURIComponent(edificio)}`,
                    { token }
                );
                setSalas(Array.isArray(data) ? data : []);
            } catch {
                setSalas([]);
            }
        }

        loadSalas();
    }, [open, edificio, token]);

    useEffect(() => {
        let ignore = false;
        if (!open || !token) return;

        async function loadPerfil() {
            try {
                const data = await apiFetch("/login/me", { token });
                if (ignore) return;

                const progs = data.programas || [];
                setProgramas(progs);
            } catch (e) {
                console.error("Error cargando perfil en ReservaModal:", e);
                if (!ignore) setProgramas([]);
            }
        }

        loadPerfil();
        return () => {
            ignore = true;
        };
    }, [open, token]);

    useEffect(() => {
        if (!form.sala || !form.fecha) {
            setTurnos([]);
            return;
        }

        let ignore = false;

        async function loadTurnos() {
            setLoading(true);
            try {
                const data = await apiFetch(`/turnos/all`, { token });
                console.log("Turnos recibidos:", data);
                if (!ignore) {
                    if (Array.isArray(data)) {
                        setTurnos(data);
                    } else {
                        console.warn("Respuesta de /turnos/all no es un array:", data);
                        setTurnos([]);
                    }
                }
            } catch (err) {
                console.error("Error cargando turnos:", err);
                if (!ignore) setTurnos([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadTurnos();

        return () => {
            ignore = true;
        };
    }, [form.sala, form.fecha, token]);

    const esDocente = useMemo(
        () => programas.some((p) => (p.rol || "").toLowerCase() === "docente"),
        [programas]
    );

    const tienePostgrado = useMemo(
        () => programas.some((p) => (p.tipo || "").toLowerCase() === "postgrado"),
        [programas]
    );

    function puedeReservarSala(sala) {
        const tipo = (sala.tipo_sala || sala.tipo || "").toLowerCase();

        if (!tipo || tipo === "libre") return true;

        if (tipo === "docente") return esDocente;

        if (tipo === "postgrado") return esDocente || tienePostgrado;

        return false;
    }

    const salasFiltradas = useMemo(
        () => salas.filter((s) => puedeReservarSala(s)),
        [salas, esDocente, tienePostgrado]
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Nueva reserva · {edificio}
                    </h3>
                </div>

                <div className="grid gap-3">
                    <label className="text-sm">
                        <span className="block text-slate-700 mb-1">Sala</span>
                        <select
                            value={form.sala}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, sala: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="">Seleccionar sala…</option>
                            {salasFiltradas.map((s) => {
                                const estadoSala = s.estado_sala || s.estado;

                                let noDisponible = false;

                                if (estadoSala) {
                                    noDisponible = estadoSala.toLowerCase() !== "disponible";
                                }

                                if (s.disponible !== undefined && s.disponible !== null) {
                                    const dispoStr = String(s.disponible).toLowerCase();
                                    if (dispoStr === "false" || dispoStr === "0") {
                                        noDisponible = true;
                                    }
                                    if (dispoStr === "true" || dispoStr === "1") {
                                        noDisponible = false;
                                    }
                                }

                                return (
                                    <option
                                        key={`${s.edificio}-${s.nombre_sala}`}
                                        value={s.nombre_sala}
                                        disabled={noDisponible}
                                    >
                                        {s.nombre_sala} · Capacidad {s.capacidad} · {s.tipo_sala}
                                        {noDisponible ? " — (No disponible)" : ""}
                                    </option>
                                );
                            })}
                        </select>
                    </label>

                    <label className="text-sm">
                        <span className="block text-slate-700 mb-1">Fecha</span>
                        <input
                            type="date"
                            value={form.fecha}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, fecha: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </label>

                    <label className="text-sm">
                        <span className="block text-slate-700 mb-1">Turno</span>
                        <select
                            disabled={!form.sala || !form.fecha || loading}
                            value={form.turno}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, turno: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600">
                            <option value="">
                                {loading ? "Cargando…" : "Seleccionar turno…"}
                            </option>
                            {turnos.map((t) => (
                                <option key={t.id_turno} value={t.id_turno}>
                                    {t.hora_inicio} – {t.hora_fin}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600">
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm?.({ edificio, ...form })}
                        disabled={!form.sala || !form.fecha || !form.turno}
                        className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
