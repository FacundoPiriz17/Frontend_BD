import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
    const { user, token } = useAuth();
    const location = useLocation();

    if (!user || !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (requiredRole && user.rol !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}