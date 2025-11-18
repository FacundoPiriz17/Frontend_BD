export default function ReservationCard({
                                            reserva,
                                            isOrganizer,
                                            onView,
                                            onCancel,
                                            onLeave,
                                            onInvite,
                                            showCancel = true,   // <-- nueva prop
                                        }) {
    const {
        sala,
        edificio,
        fecha,
        turno,
        participantes,
        capacidad,
        estado,
        organiza,
    } = reserva;

    return (
        <div
            className="
        group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
        transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md
      "
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                            {sala}
                        </h3>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            {edificio}
                        </span>
                    </div>

                    <p className="text-xs text-slate-600 sm:text-sm">
                        {fecha} · {turno}
                    </p>

                    {organiza && (
                        <p className="text-[11px] text-slate-500">
                            Organiza: <span className="font-medium text-slate-800">{organiza}</span>
                        </p>
                    )}

                    <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
                        <span>
                            Participantes:{" "}
                            <strong className="text-slate-800">
                                {participantes}/{capacidad}
                            </strong>
                        </span>

                        <span className="text-slate-400">·</span>

                        <span
                            className={[
                                "font-medium",
                                estado === "Activa"
                                    ? "text-blue-700"
                                    : estado === "Cancelada"
                                        ? "text-red-600"
                                        : estado === "Finalizada"
                                            ? "text-green-600"
                                            : "text-slate-600",
                            ].join(" ")}
                        >
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

                    {isOrganizer ? (
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
