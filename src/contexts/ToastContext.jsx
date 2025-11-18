import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 1;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ type = "info", message }) => {
        if (!message) return;
        const id = idCounter++;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const value = { showToast };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-4 top-16 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={[
                            "pointer-events-auto min-w-[220px] max-w-sm rounded-2xl border px-3 py-2 text-sm shadow-lg",
                            t.type === "success" &&
                            "border-emerald-600 bg-emerald-50 text-emerald-800",
                            t.type === "error" &&
                            "border-red-600 bg-red-50 text-red-800",
                            t.type === "info" &&
                            "border-blue-600 bg-blue-50 text-blue-800",
                        ].join(" ")}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast debe usarse dentro de un ToastProvider");
    }
    return ctx;
}
