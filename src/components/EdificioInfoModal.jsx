import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function EdificioInfoModal({ open, onClose, edificio, token }) {
    const [salas, setSalas] = useState([]);

    useEffect(() => {
        if (!open) return;
        let ignore = false;
        async function load() {
            try {
                const data = await apiFetch(`/salas/${encodeURIComponent(edificio)}`, { token });
                if (!ignore) setSalas(Array.isArray(data) ? data : []);
            } catch {
                if (!ignore) setSalas([]);
            }
        }
        load();
        return () => { ignore = true; };
    }, [open, edificio, token]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Salas · {edificio}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="grid gap-2 max-h-[60vh] overflow-auto">
                    {salas.map((s) => (
                        <div key={s.nombre_sala} className="rounded-xl border border-slate-200 p-3">
                            <div className="font-medium text-slate-900">{s.nombre_sala}</div>
                            <div className="text-sm text-slate-600">
                                Capacidad: {s.capacidad} · Tipo: {s.tipo_sala} · Disponible:{" "}
                                {s.disponible ? "Sí" : "No"}
                            </div>
                        </div>
                    ))}
                    {salas.length === 0 && (
                        <div className="text-sm text-slate-600">No hay salas para este edificio.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
