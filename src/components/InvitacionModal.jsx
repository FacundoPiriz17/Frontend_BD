import { useEffect, useMemo, useState } from "react";
import { isValidCI, isValidEmail } from "../utils/validators";
import { apiFetch } from "../utils/api";

export default function InvitacionModal({
                                            open,
                                            onClose,
                                            reservaId,
                                            token,
                                            onSaved,
                                        }) {
    const [entrada, setEntrada] = useState("");
    const [invitados, setInvitados] = useState([]);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setEntrada("");
            setInvitados([]);
            setError("");
        }
    }, [open]);

    const puedeAgregar = useMemo(() => {
        const value = entrada.trim();
        if (!value) return false;
        if (isValidCI(value)) {
            return !invitados.some((i) => i.ci === value);
        }
        if (isValidEmail(value)) {
            return !invitados.some(
                (i) => i.email?.toLowerCase() === value.toLowerCase()
            );
        }
        return false;
    }, [entrada, invitados]);

    function agregar() {
        const value = entrada.trim();
        if (isValidCI(value)) {
            setInvitados((prev) => [...prev, { ci: value }]);
            setEntrada("");
            setError("");
            return;
        }
        if (isValidEmail(value)) {
            setInvitados((prev) => [...prev, { email: value }]);
            setEntrada("");
            setError("");
            return;
        }
        setError("Ingresa una cédula (8 dígitos) o un email válido.");
    }

    function eliminar(idx) {
        setInvitados((prev) => prev.filter((_, i) => i !== idx));
    }

    async function guardar() {
        if (invitados.length === 0) {
            setError("Agrega al menos un invitado.");
            return;
        }

        try {
            setEnviando(true);
            setError("");

            for (const inv of invitados) {
                const valor = inv.email ?? inv.ci;
                if (!valor) continue;

                await apiFetch("/reservas/invitar", {
                    method: "POST",
                    token,
                    body: {
                        email_invitado: valor,
                        id_reserva: reservaId,
                    },
                });
            }

            onSaved?.();
            onClose?.();
        } catch (e) {
            setError(e.message || "No se pudo enviar la invitación.");
        } finally {
            setEnviando(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Invitar participantes
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="grid gap-3">
                    <label className="text-sm">
                        <span className="block text-slate-700 mb-1">
                            Agregar por CI (8 dígitos) o Email
                        </span>
                        <div className="flex gap-2">
                            <input
                                value={entrada}
                                onChange={(e) => setEntrada(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    puedeAgregar &&
                                    agregar()
                                }
                                placeholder="12345678 o nombre@correo.com"
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                                onClick={agregar}
                                disabled={!puedeAgregar}
                                className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                Añadir
                            </button>
                        </div>
                    </label>

                    {error && (
                        <div className="text-sm text-red-600">{error}</div>
                    )}

                    <div className="max-h-[40vh] overflow-auto rounded-xl border border-slate-200">
                        {invitados.length === 0 ? (
                            <div className="p-3 text-sm text-slate-600">
                                Aún no agregaste invitados.
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-200">
                                {invitados.map((p, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between px-3 py-2"
                                    >
                                        <div className="text-sm text-slate-800">
                                            {p.ci
                                                ? `CI: ${p.ci}`
                                                : `Email: ${p.email}`}
                                        </div>
                                        <button
                                            onClick={() => eliminar(idx)}
                                            className="text-sm text-blue-700 hover:underline"
                                        >
                                            Quitar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={guardar}
                        disabled={enviando || invitados.length === 0}
                        className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        {enviando ? "Enviando…" : "Enviar invitaciones"}
                    </button>
                </div>
            </div>
        </div>
    );
}
