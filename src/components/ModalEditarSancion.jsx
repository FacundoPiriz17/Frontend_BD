import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function ModalEditarSancion({open, onClose, sancion, titulo, token, onConfirm}) {

    if (!open) return null;

    const [ci, setCi] = useState("");
    const [motivo, setMotivo] = useState("");
    const [inicio, setInicio] = useState("");
    const [fin, setFin] = useState("");
    const [error, setError] = useState("");


    // Cuando abre modal cargar datos si es edición, o limpiar si es nuevo
    useEffect(() => {
        setError("");

        if (sancion) {
            setCi(sancion.ci_participante);
            setMotivo(sancion.motivo);
            setInicio(sancion.fecha_inicio);
            setFin(sancion.fecha_fin);
        } else {
            setCi("");
            setMotivo("Uso indebido");
            setInicio("");
            setFin("");
        }
    }, [sancion, open]);

    async function handleSave() {

        try {
            if (sancion) {
                // Editar sancion
                await apiFetch(`/sanciones/modificar/${sancion.id_sancion}`, {
                    method: "PUT",
                    token,
                    body: {
                        ci_participante: ci,
                        motivo,
                        fecha_inicio: inicio,
                        fecha_fin: fin,
                    },
                });
            } else {
                // Agregar sanción
                await apiFetch(`/sanciones/registrar`, {
                    method: "POST",
                    token,
                    body: {
                        ci_participante: ci,
                        motivo,
                        fecha_inicio: inicio,
                        fecha_fin: fin,
                    },
                });
            }

            onClose();
            await onConfirm();

            // Setear el tipo de error
        }catch (err) {
            console.error("Hubo un error :( ", err);

            let mensaje = "";

            try {
                const parsed = JSON.parse(err.message);
                mensaje = (parsed.error || "").toLowerCase();
            } catch {
                mensaje = err.message?.toLowerCase() || "";
            }

            if (mensaje.includes("cédula inválida") || mensaje.includes("cedula invalida")) {
                setError("Cédula inválida");
            }
            else if (mensaje.includes("ya tiene una sanción") || mensaje.includes("activa")) {
                setError("El participante ya está sancionado en esa fecha");
            }
            else if (mensaje.includes("faltan datos")) {
                setError("Faltan datos requeridos");
            }
            else if (mensaje.includes("fecha de fin") || mensaje.includes("posterior a la de inicio")) {
                setError("La fecha de fin debe ser posterior a la de inicio");
            }
            else {
                setError("Error al procesar la sanción");
            }
        }



    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-gray-900/20 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">

                <h2 className="text-xl font-semibold text-blue-800">
                    {titulo}
                </h2>

                <div className="mt-4 space-y-3">
                    <div>
                        <label className="text-sm font-semibold">Cédula</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-full border px-2 py-1 rounded"
                            value={ci}
                            onChange={(e) => setCi(e.target.value.replace(/\D/g, ""))}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Motivo</label>
                        <select
                            className="w-full border px-2 py-1 rounded"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        >
                            <option>Uso indebido</option>
                            <option>Morosidad</option>
                            <option>Vandalismo</option>
                            <option>Inasistencia</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Fecha inicio</label>
                        <input
                            type="date"
                            className="w-full border px-2 py-1 rounded"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Fecha fin</label>
                        <input
                            type="date"
                            className="w-full border px-2 py-1 rounded"
                            value={fin}
                            onChange={(e) => setFin(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="text-red-600 text-sm font-semibold mt-2">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-1 rounded bg-blue-800 hover:bg-blue-700 text-white"
                    >
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}
