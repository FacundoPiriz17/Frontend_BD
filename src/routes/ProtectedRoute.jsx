import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function getTokenExp(token) {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(parts[1].length + (4 - (parts[1].length % 4)) % 4, "=");
        const json = JSON.parse(atob(payload));
        return json.exp || null;
    } catch {
        return null;
    }
}

export default function ProtectedRoute({ requiredRole }) {
    const { user, token, logout } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const exp = getTokenExp(token);
    const nowSec = Date.now() / 1000;

    if (!exp || nowSec >= exp) {
        logout();
        return (
            <Navigate
                to="/session-expired"
                state={{ from: location }}
                replace
            />
        );
    }

    if (requiredRole && user.rol !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}