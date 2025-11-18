export default function ModalEliminar({open, onClose, onConfirm, objeto = "este elemento"   //complemento dinámico
}) {

    if (!open) return null;

    async function handleDelete() {
        await onConfirm();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-gray-900/20 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">

                <h2 className="text-lg font-semibold text-red-700">Eliminar</h2>

                <p className="mt-3 text-gray-700">
                    ¿Estás seguro que deseas eliminar {objeto}?
                </p>

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        No
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                        Sí
                    </button>
                </div>
            </div>
        </div>
    );
}
