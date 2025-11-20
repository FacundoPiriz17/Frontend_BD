import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ requiredRole, requiredRoles }) {
    const { user, token } = useAuth();
    const location = useLocation();

    if (!user || !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const allowedRoles = [];

    if (requiredRole) {
        allowedRoles.push(requiredRole);
    }

    if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
        allowedRoles.push(...requiredRoles);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}