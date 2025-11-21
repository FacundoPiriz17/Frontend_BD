import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiFetch } from "../utils/api.js";
import ModalEliminar from "./ModalEliminar.jsx";

export default function ReservationCard({
  reserva,
  isOrganizer,
  isAdmin = false,
  onView,
  onCancel,
  onLeave,
  onInvite,
  onEdit,
  onDelete,
  showCancel = true,
}) {
  const {
    sala,
    edificio,
    fecha,
    turno,
    participantes,
    capacidad,
    estado,
    organizador,
  } = reserva;

  const stateColorClass =
    estado === "Activa"
      ? "text-blue-700"
      : estado === "Cancelada"
      ? "text-red-600"
      : estado === "Finalizada"
      ? "text-green-600"
      : "text-slate-600";
  const [modalEliminar, setModalEliminar] = useState({ open: false, id: null });
  const { token } = useAuth();

  function handleOpenEliminar(id) {
    setModalEliminar({ open: true, id });
  }

  return (
    <div
      className="
        group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
        transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md
      "
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {sala}
            </h3>

            <span
              className={[
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                "bg-blue-50 text-blue-700",
              ].join(" ")}
            >
              {edificio}
            </span>
          </div>

          <p className="text-xs text-slate-600 sm:text-sm">
            {fecha} · {turno}
          </p>

          {organizador && (
            <p className="text-[11px] text-slate-500">
              Organiza:{" "}
              <span className="font-medium text-slate-800">
                {organizador?.nombre
                  ? `${organizador.nombre} ${organizador.apellido}`
                  : organizador?.ci ?? organizador}
              </span>
            </p>
          )}

          <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
            <span>
              Participantes:{" "}
              <strong className="text-slate-800">
                {participantes ?? 0}/{capacidad ?? 0}
              </strong>
            </span>

            <span className="text-slate-400">·</span>

            <span className={["font-medium", stateColorClass].join(" ")}>
              {estado}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-row">
          <button
            onClick={() => onView?.(reserva)}
            className="
              rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800
              hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600
            "
          >
            Ver
          </button>

          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(reserva)}
                className="
                  rounded-xl border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700
                  hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-blue-600
                "
              >
                Editar
              </button>

              <button
                onClick={() => onDelete?.(reserva)}
                className="
      rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white
      hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600
    "
              >
                Eliminar
              </button>
            </>
          ) : isOrganizer ? (
            <>
              <button
                onClick={() => onInvite?.(reserva)}
                className="
                  rounded-xl border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700
                  hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600
                "
              >
                Invitar
              </button>

              {showCancel && (
                <button
                  onClick={() => onCancel?.(reserva)}
                  className="
                    rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white
                    hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600
                  "
                >
                  Cancelar
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => onLeave?.(reserva)}
              className="
                rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white
                hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600
              "
            >
              Salirme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
