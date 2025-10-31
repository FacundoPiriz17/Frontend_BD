import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Prueba from "./pages/Prueba";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Navigate to="/login"/>} path="/" exact />
                    <Route element={<LoginPage />} path="/login" exact />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Prueba />} path="/prueba" exact />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App
