import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";

export default function ReservaModal({
                                         open,
                                         onClose,
                                         token,
                                         onConfirm,
                                         modo = "agregar",
                                         reserva = null,     // solo admin
                                         edificio = null,    // solo usuario
                                         isAdmin = false     // 🔥 clave
                                     }) {
    if (!open) return null;

    const esEditar = isAdmin && modo === "editar" && !!reserva;

    // -------------------------
    // ESTADOS COMPARTIDOS
    // -------------------------
    const [salas, setSalas] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [edificios, setEdificios] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(false);
    const [error, setError] = useState("");

    // -------------------------
    // FORMULARIO SEGÚN ROL
    // -------------------------
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

    // -------------------------------------------------------------------
    // ADMIN → cargar edificios
    // -------------------------------------------------------------------
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


    // -------------------------------------------------------------------
    // SALAS (admin y usuario)
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!open) return;

        async function loadSalas() {
            try {
                let resp;

                if (isAdmin) {
                    resp = await apiFetch("/salas/all", { token });
                } else {
                    resp = await apiFetch(`/salas/${encodeURIComponent(edificio)}`, { token });

                }

                setSalas(Array.isArray(resp) ? resp : []);
            } catch {
                setSalas([]);
            }
        }

        loadSalas();
    }, [open, edificio, isAdmin, token]);



    // -------------------------------------------------------------------
    // TURNOS (admin y usuario)
    // -------------------------------------------------------------------
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


    // -------------------------------------------------------------------
    // PRECARGA (solo admin → editar)
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!open) return;

        if (esEditar) {
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


    // -------------------------------------------------------------------
    // HANDLER GUARDAR (admin)
    // -------------------------------------------------------------------
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


    // -------------------------------------------------------------------
    // UI ADMIN
    // -------------------------------------------------------------------
    if (isAdmin) {
        return (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">

                    <h3 className="text-lg font-bold text-green-700 mb-3">
                        {esEditar ? `Editar reserva #${reserva?.id_reserva}` : "Nueva reserva (Admin)"}
                    </h3>

                    {/* EDIFICIO */}
                    <label className="text-sm font-medium">Edificio</label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 mb-2"
                        value={form.edificio}
                        onChange={(e) => setForm(f => ({ ...f, edificio: e.target.value }))}
                    >
                        <option value="">Seleccionar edificio…</option>
                        {edificios.map(ed => (
                            <option key={ed.nombre_edificio} value={ed.nombre_edificio}>
                                {ed.nombre_edificio}
                            </option>
                        ))}
                    </select>

                    {/* SALA */}
                    <label className="text-sm font-medium mt-2">Sala</label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 mb-2"
                        value={form.nombre_sala}
                        onChange={(e) => setForm(f => ({ ...f, nombre_sala: e.target.value }))}
                    >
                        <option value="">Seleccionar sala…</option>
                        {salas.map(s => (
                            <option key={s.nombre_sala} value={s.nombre_sala}>
                                {s.nombre_sala} · Cap {s.capacidad}
                            </option>
                        ))}
                    </select>

                    {/* FECHA */}
                    <label className="text-sm font-medium">Fecha</label>
                    <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2 mb-2"
                        value={form.fecha}
                        onChange={(e) => setForm(f => ({ ...f, fecha: e.target.value }))}
                    />

                    {/* TURNO */}
                    <label className="text-sm font-medium">Turno</label>
                    <select
                        disabled={loadingTurnos}
                        className="w-full border rounded-lg px-3 py-2 mb-2"
                        value={form.id_turno}
                        onChange={(e) => setForm(f => ({ ...f, id_turno: e.target.value }))}
                    >
                        <option value="">
                            {loadingTurnos ? "Cargando…" : "Seleccionar turno…"}
                        </option>
                        {turnos.map(t => (
                            <option key={t.id_turno} value={t.id_turno}>
                                {t.hora_inicio} – {t.hora_fin}
                            </option>
                        ))}
                    </select>

                    {/* CI ORGANIZADOR (solo al agregar) */}
                    {!esEditar && (
                        <label className="text-sm font-medium">CI del organizador</label>
                    )}
                    {!esEditar && (
                        <input
                            type="text"
                            className="w-full border rounded-lg px-3 py-2 mb-2"
                            value={form.ci_organizador}
                            onChange={(e) =>
                                setForm(f => ({ ...f, ci_organizador: e.target.value.replace(/\D/g, "") }))
                            }
                        />
                    )}

                    {/* ESTADO (solo editar) */}
                    {esEditar && (
                        <>
                            <label className="text-sm font-medium">Estado</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 mb-2"
                                value={form.estado}
                                onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
                            >
                                <option value="Activa">Activa</option>
                                <option value="Finalizada">Finalizada</option>
                                <option value="Sin asistencia">Sin asistencia</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </>
                    )}

                    {error && <p className="text-red-600">{error}</p>}

                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={onClose} className="border px-3 py-2 rounded-xl">
                            Cancelar
                        </button>
                        <button
                            onClick={handleAdminSave}
                            className="bg-green-700 text-white px-3 py-2 rounded-xl"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    // -------------------------------------------------------------------
    // UI USUARIO
    // -------------------------------------------------------------------
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">

                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                    Nueva reserva · {edificio}
                </h3>

                {/* SALA */}
                <label className="text-sm font-medium">Sala</label>
                <select
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                    value={form.sala}
                    onChange={(e) => setForm(f => ({ ...f, sala: e.target.value }))}
                >
                    <option value="">Seleccionar sala…</option>
                    {salas.map(s => (
                        <option key={s.nombre_sala} value={s.nombre_sala}>
                            {s.nombre_sala} · Cap {s.capacidad}
                        </option>
                    ))}
                </select>

                {/* FECHA */}
                <label className="text-sm font-medium">Fecha</label>
                <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                    value={form.fecha}
                    onChange={(e) => setForm(f => ({ ...f, fecha: e.target.value }))}
                />

                {/* TURNO */}
                <label className="text-sm font-medium">Turno</label>
                <select
                    disabled={!form.sala || !form.fecha || loadingTurnos}
                    className="w-full border rounded-lg px-3 py-2 mb-2 disabled:bg-slate-100"
                    value={form.turno}
                    onChange={(e) => setForm(f => ({ ...f, turno: e.target.value }))}
                >
                    <option value="">
                        {loadingTurnos ? "Cargando…" : "Seleccionar turno…"}
                    </option>
                    {turnos.map(t => (
                        <option key={t.id_turno} value={t.id_turno}>
                            {t.hora_inicio} – {t.hora_fin}
                        </option>
                    ))}
                </select>


                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="border px-3 py-2 rounded-xl">
                        Cancelar
                    </button>
                    <button
                        className="bg-blue-700 text-white px-3 py-2 rounded-xl"
                        disabled={!form.sala || !form.fecha || !form.turno}
                        onClick={() =>
                            onConfirm?.({
                                edificio,
                                sala: form.sala,
                                fecha: form.fecha,
                                turno: form.turno,
                            })
                        }
                    >
                        Confirmar
                    </button>
                </div>

            </div>
        </div>
    );
}
