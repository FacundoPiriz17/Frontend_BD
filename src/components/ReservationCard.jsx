export default function ReservationCard({
                                            reserva,
                                            isOrganizer,
                                            onView,
                                            onCancel,
                                            onLeave,
                                            onInvite,
                                        }) {
    const { sala, edificio, fecha, turno, participantes, capacidad, estado } = reserva;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <div className="text-slate-900 font-semibold">
                        {sala} · {edificio}
                    </div>
                    <div className="text-sm text-slate-600">
                        {fecha} · {turno}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                        Participantes: {participantes}/{capacidad} · Estado: {estado}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onView?.(reserva)}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Ver
                    </button>

                    {isOrganizer ? (
                        <>
                            <button
                                onClick={() => onInvite?.(reserva)}
                                className="rounded-xl border border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                Invitar
                            </button>
                            <button
                                onClick={() => onCancel?.(reserva)}
                                className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onLeave?.(reserva)}
                            className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            Salirme
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
