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

  const { sidebarBgClass, sidebarBorderClass, itemHoverClass } = (() => {
    switch (role) {
      case "Administrador":
        return {
          sidebarBgClass: "bg-green-800",
          sidebarBorderClass: "border-green-800",
          itemHoverClass: "hover:bg-[#fcfaee] hover:text-green-800",
        };
      case "Funcionario":
        return {
          sidebarBgClass: "bg-yellow-500",
          sidebarBorderClass: "border-yellow-500",
          itemHoverClass: "hover:bg-yellow-600/40",
        };
      default:
        return {
          sidebarBgClass: "bg-[#0b1743]",
          sidebarBorderClass: "border-[#0b1743]",
          itemHoverClass: "hover:bg-white/10",
        };
    }
  })();

  return (
    <div
      className={`sticky left-0 top-0 bottom-0 w-20 hover:w-64
        ${sidebarBgClass} text-white flex flex-col transition-all duration-300 ease-in-out
        overflow-hidden border-r-2 ${sidebarBorderClass} group shadow-xl z-30`}
    >
      <nav className="flex-1 flex flex-col justify-start pt-6 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-3">
          <NavItem
            icon={<FaChartBar />}
            label="Estadísticas"
            href="/stats"
            hoverClass={itemHoverClass}
          />

          <NavItem
            icon={<FaCalendarAlt />}
            label="Gestionar reservas"
            href="/reservas"
            hoverClass={itemHoverClass}
          />

          {isAdmin && (
            <NavItem
              icon={<FaBuilding />}
              label="Gestionar salas"
              href="/salas"
              hoverClass={itemHoverClass}
            />
          )}

          <NavItem
            icon={<FaBan />}
            label="Gestionar sanciones"
            href="/sanciones"
            hoverClass={itemHoverClass}
          />

          <NavItem
            icon={<FaStar />}
            label="Gestionar reseñas"
            href="/reseñas"
            hoverClass={itemHoverClass}
          />

          {isAdmin && (
            <NavItem
              icon={<FaUser />}
              label="Gestionar usuarios"
              href="/usuarios"
              hoverClass={itemHoverClass}
            />
          )}
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, href, hoverClass }) {
  return (
    <Link
      to={href}
      className={`flex items-center gap-4 h-14 cursor-pointer rounded-xl
            ${hoverClass} transition-all duration-200`}
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
