import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Prueba from "./pages/Prueba";
import ProtectedRoute from "./routes/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import ParticipantePage from "./pages/participante/ParticipantePage.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import FuncionarioPage from "./pages/funcionario/FuncionarioPage.jsx";
import StatsPage from "./pages/stats/StatsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Navigate to="/login" />} path="/" exact />

          <Route element={<LoginPage />} path="/login" exact />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute requiredRole="Participante" />}>
            <Route path="/participante" element={<ParticipantePage />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="Funcionario" />}>
            <Route path="/funcionario" element={<FuncionarioPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="Administrador" />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
