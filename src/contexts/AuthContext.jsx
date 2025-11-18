import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        try {
            const data = localStorage.getItem("user");
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch {
            setUser(null);
        }
    }, [token]);

    const saveAuth = (usuario, nuevoToken) => {
        setUser(usuario);
        setToken(nuevoToken);
        localStorage.setItem("token", nuevoToken);
        localStorage.setItem("user", JSON.stringify(usuario));
    };

    const login = async (email, contrasena) => {
        try {
            const res = await fetch("http://127.0.0.1:5000/login/inicio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, contrasena }),
            });

            const data = await res.json();

            if (res.ok) {
                saveAuth(data.usuario, data.token);
                return { ok: true };
            } else {
                return { ok: false, error: data.error };
            }
        } catch (err) {
            return { ok: false, error: "Error de conexión con el servidor" };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const updateToken = (nuevoToken) => {
        setToken(nuevoToken);
        localStorage.setItem("token", nuevoToken);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
