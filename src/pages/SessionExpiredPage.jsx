import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../utils/api";
import { useToast } from "../contexts/ToastContext";

export default function SessionExpiredPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, updateToken, logout } = useAuth();
    const { showToast } = useToast();

    const [loadingRefresh, setLoadingRefresh] = useState(false);

    const fromPath = location.state?.from?.pathname || "/perfil";

    async function handleRefresh() {
        try {
            setLoadingRefresh(true);
            const res = await apiFetch("/login/renovar-token", {
                method: "POST",
                token,
            });

            const nuevoToken = res.token;
            if (!nuevoToken) {
                throw new Error("No se recibió un token nuevo desde el servidor.");
            }

            updateToken(nuevoToken);

            showToast({
                type: "success",
                message: "Sesión renovada correctamente.",
            });

            navigate(fromPath, { replace: true });
        } catch (e) {
            showToast({
                type: "error",
                message: e.message || "No se pudo renovar la sesión.",
            });
        } finally {
            setLoadingRefresh(false);
        }
    }

    function handleGoLogin() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md border border-slate-200">
                <h1 className="text-xl font-bold text-slate-900 mb-2 text-center">
                    Sesión expirada
                </h1>
                <p className="text-sm text-slate-600 mb-4 text-center">
                    Tu sesión ha caducado o tu token ya no es válido. Elegí cómo querés continuar.
                </p>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loadingRefresh || !token}
                        className="w-full inline-flex justify-center items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loadingRefresh ? "Renovando sesión..." : "Renovar sesión"}
                    </button>

                    <button
                        type="button"
                        onClick={handleGoLogin}
                        className="w-full inline-flex justify-center items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50"
                    >
                        Volver al login
                    </button>
                </div>
            </div>
        </div>
    );
}
