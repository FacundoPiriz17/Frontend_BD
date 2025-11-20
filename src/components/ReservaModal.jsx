import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../utils/api.js";

export default function ReservaModal({
    open,
    onClose,
    token,
    onConfirm,
    modo = "agregar",
    reserva = null,   // solo admin
    edificio = null,  // solo usuario
    isAdmin = false   // 🔥 clave
}) {
    if (!open) return null;

    const esEditar = isAdmin && modo === "editar" && !!reserva;

    const [salas, setSalas] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [edificios, setEdificios] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(false);
    const [error, setError] = useState("");
    const [programas, setProgramas] = useState([]);


    const [form, setForm] = useState(
        isAdmin
            ? {
                  edificio: "",
                  nombre_sala: "",
                  fecha: "",
                  id_turno: "",
                  ci_organizador: "",
                  estado: "Activa",
              }
            : {
                  sala: "",
                  fecha: "",
                  turno: "",
              }
    );


    useEffect(() => {
        if (!open || !isAdmin) return;

        async function loadEdificios() {
            try {
                const data = await apiFetch("/edificios/todos", { token });
                setEdificios(Array.isArray(data) ? data : []);
            } catch {
                setEdificios([]);
            }
        }

        loadEdificios();
    }, [open, isAdmin, token]);


    useEffect(() => {
        if (!open) return;

        async function loadSalas() {
            try {
                let resp;

                if (isAdmin) {
                    resp = await apiFetch("/salas/all", { token });
                } else {
                    resp = await apiFetch(
                        `/salas/${encodeURIComponent(edificio)}`,
                        { token }
                    );
                }

                setSalas(Array.isArray(resp) ? resp : []);
            } catch {
                setSalas([]);
            }
        }

        loadSalas();
    }, [open, edificio, isAdmin, token]);

    useEffect(() => {
        let ignore = false;
        if (!open || !token || isAdmin) return;

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
    }, [open, token, isAdmin]);

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

    useEffect(() => {
        if (!open) return;

        const salaSeleccionada = isAdmin ? form.nombre_sala : form.sala;
        const fechaSeleccionada = form.fecha;

        if (!salaSeleccionada || !fechaSeleccionada) {
            setTurnos([]);
            return;
        }

        async function loadTurnos() {
            try {
                setLoadingTurnos(true);
                const data = await apiFetch("/turnos/all", { token });
                setTurnos(Array.isArray(data) ? data : []);
            } finally {
                setLoadingTurnos(false);
            }
        }

        loadTurnos();
    }, [form.sala, form.fecha, form.nombre_sala, isAdmin, token, open]);

    useEffect(() => {
        if (!open) return;

        if (esEditar && reserva) {
            setForm({
                edificio: reserva.edificio,
                nombre_sala: reserva.nombre_sala,
                fecha: reserva.fecha?.slice(0, 10),
                id_turno: reserva.id_turno,
                ci_organizador: reserva.ci_organizador,
                estado: reserva.estado ?? "Activa",
            });
        }
    }, [open, esEditar, reserva]);

    async function handleAdminSave() {
        setError("");

        const body = {
            nombre_sala: form.nombre_sala,
            edificio: form.edificio,
            fecha: form.fecha,
            id_turno: form.id_turno,
            ci: form.ci_organizador,
            estado: form.estado,
        };

        try {
            if (esEditar) {
                await apiFetch(`/reservas/modificar/${reserva.id_reserva}`, {
                    method: "PUT",
                    token,
                    body,
                });
            } else {
                await apiFetch("/reservas/registrar", {
                    method: "POST",
                    token,
                    body,
                });
            }

            onClose();
            await onConfirm?.();
        } catch (err) {
            setError("Error al guardar reserva.");
        }
    }

    if (isAdmin) {
        return (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
                    <h3 className="mb-3 text-lg font-bold text-green-700">
                        {esEditar
                            ? `Editar reserva #${reserva?.id_reserva}`
                            : "Nueva reserva (Admin)"}
                    </h3>

                    <label className="text-sm font-medium">
                        Edificio
                        <select
                            className="mt-1 mb-2 w-full rounded-lg border px-3 py-2"
                            value={form.edificio}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, edificio: e.target.value }))
                            }>
                            <option value="">Seleccionar edificio…</option>
                            {edificios.map((ed) => (
                                <option
                                    key={ed.nombre_edificio}
                                    value={ed.nombre_edificio}
                                >
                                    {ed.nombre_edificio}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="mt-2 text-sm font-medium">
                        Sala
                        <select
                            className="mt-1 mb-2 w-full rounded-lg border px-3 py-2"
                            value={form.nombre_sala}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, nombre_sala: e.target.value }))
                            }>
                            <option value="">Seleccionar sala…</option>
                            {salas.map((s) => (
                                <option key={s.nombre_sala} value={s.nombre_sala}>
                                    {s.nombre_sala} · Cap {s.capacidad}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-sm font-medium">
                        Fecha
                        <input
                            type="date"
                            className="mt-1 mb-2 w-full rounded-lg border px-3 py-2"
                            value={form.fecha}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, fecha: e.target.value }))
                            }
                        />
                    </label>

                    <label className="text-sm font-medium">
                        Turno
                        <select
                            disabled={loadingTurnos}
                            className="mt-1 mb-2 w-full rounded-lg border px-3 py-2"
                            value={form.id_turno}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, id_turno: e.target.value }))
                            }
                        >
                            <option value="">
                                {loadingTurnos ? "Cargando…" : "Seleccionar turno…"}
                            </option>
                            {turnos.map((t) => (
                                <option key={t.id_turno} value={t.id_turno}>
                                    {t.hora_inicio} – {t.hora_fin}
                                </option>
                            ))}
                        </select>
                    </label>

                    {!esEditar && (
                        <label className="text-sm font-medium">
                            CI del organizador
                            <input
                                type="text"
                                className="mt-1 mb-2 w-full rounded-lg border px-3 py-2"
                                value={form.ci_organizador}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        ci_organizador: e.target.value.replace(/\D/g, ""),
                                    }))
                                }
                            />
                        </label>
                    )}

                    {esEditar && (
                        <label className="text-sm font-medium">
                            Estado
                            <select
                                className="mt-1 mb-2 w-full rounded-lg border px-3 py-2"
                                value={form.estado}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, estado: e.target.value }))
                                }
                            >
                                <option value="Activa">Activa</option>
                                <option value="Finalizada">Finalizada</option>
                                <option value="Sin asistencia">Sin asistencia</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </label>
                    )}

                    {error && <p className="text-red-600">{error}</p>}

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="rounded-xl border px-3 py-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAdminSave}
                            className="rounded-xl bg-green-700 px-3 py-2 text-white"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

  
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-blue-700">
                        Nueva reserva · {edificio}
                    </h3>
                </div>

                <div className="grid gap-3">
                    <label className="text-sm">
                        <span className="mb-1 block text-slate-700">Sala</span>
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
                                    noDisponible =
                                        estadoSala.toLowerCase() !== "disponible";
                                }

                                if (
                                    s.disponible !== undefined &&
                                    s.disponible !== null
                                ) {
                                    const dispoStr = String(
                                        s.disponible
                                    ).toLowerCase();
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
                                        {s.nombre_sala} · Capacidad {s.capacidad} ·{" "}
                                        {s.tipo_sala}
                                        {noDisponible ? " — (No disponible)" : ""}
                                    </option>
                                );
                            })}
                        </select>
                    </label>

                    <label className="text-sm">
                        <span className="mb-1 block text-slate-700">Fecha</span>
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
                        <span className="mb-1 block text-slate-700">Turno</span>
                        <select
                            disabled={!form.sala || !form.fecha || loadingTurnos}
                            value={form.turno}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, turno: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="">
                                {loadingTurnos ? "Cargando…" : "Seleccionar turno…"}
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
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!form.sala || !form.fecha || !form.turno}
                        onClick={() =>
                            onConfirm?.({
                                edificio,
                                sala: form.sala,
                                fecha: form.fecha,
                                turno: form.turno,
                            })
                        }
                        className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
