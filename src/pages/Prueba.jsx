import { useAuth } from "../contexts/AuthContext";

export default function Prueba() {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">Bienvenido, {user?.nombre}</h1>
            <p>Rol: {user?.rol}</p>
            <button
                onClick={logout}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
                Cerrar sesión
            </button>
        </div>
    );
}
