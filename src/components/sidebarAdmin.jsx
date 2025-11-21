import {
    FaChartBar,
    FaCalendarAlt,
    FaBuilding,
    FaBan,
    FaStar,
    FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SidebarAdmin() {
    const { user } = useAuth();
    const role = user?.rol;

    if (role !== "Administrador" && role !== "Funcionario") {
        return null;
    }

    const isAdmin = role === "Administrador";

    return (
        <div
            className="sticky left-0 top-0 bottom-0 w-20 hover:w-64 bg-[#0b1743] text-white flex flex-col transition-all duration-300 ease-in-out overflow-hidden group z-30"
        >
            <nav className="flex-1 flex flex-col justify-start pt-6 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col gap-3">
                    <NavItem
                        icon={<FaChartBar />}
                        label="Estadísticas"
                        href="/stats"
                    />

                    <NavItem
                        icon={<FaCalendarAlt />}
                        label="Gestionar reservas"
                        href="/reservas"
                    />

                    {isAdmin && (
                        <NavItem
                            icon={<FaBuilding />}
                            label="Gestionar salas"
                            href="/salas"
                        />
                    )}

                    <NavItem
                        icon={<FaBan />}
                        label="Gestionar sanciones"
                        href="/sanciones"
                    />

                    <NavItem
                        icon={<FaStar />}
                        label="Gestionar reseñas"
                        href="/reseñas"
                    />

                    {isAdmin && (
                        <NavItem
                            icon={<FaUser />}
                            label="Gestionar usuarios"
                            href="/usuarios"
                        />
                    )}
                </div>
            </nav>
        </div>
    );
}

function NavItem({ icon, label, href }) {
    return (
        <Link
            to={href}
            className="flex items-center gap-4 h-14 cursor-pointer rounded-xl hover:bg-white/10 transition-all duration-200"
        >
            <div className="flex items-center justify-center w-20 flex-shrink-0">
                <span className="text-2xl">{icon}</span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-medium pr-4">
        {label}
      </span>
        </Link>
    );
}
