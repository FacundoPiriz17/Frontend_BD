import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.rol !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}