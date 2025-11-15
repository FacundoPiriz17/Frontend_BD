import {
  FaChartBar,
  FaCalendarAlt,
  FaBuilding,
  FaBan,
  FaStar,
  FaUser,
  FaBell,
} from "react-icons/fa";

export default function SidebarAdmin() {
  return (
    <div className="h-screen w-16 hover:w-60 bg-green-800 text-white flex flex-col transition-all duration-300 overflow-hidden -mt-1 mb-4 p-4 border border-green-800 rounded-md group">
      <NavItem icon={<FaChartBar />} label="Estadísticas" href="/stats" />
      <NavItem
        icon={<FaCalendarAlt />}
        label="Gestionar reservas"
        href="/reservas"
      />
      <NavItem icon={<FaBuilding />} label="Gestionar salas" href="/salas" />
      <NavItem icon={<FaBan />} label="Gestionar sanciones" href="/sanciones" />
      <NavItem icon={<FaStar />} label="Gestionar reseñas" href="/reseñas" />
      <NavItem icon={<FaUser />} label="Gestionar usuarios" href="/usuarios" />
    </div>
  );
}

function NavItem({ icon, label, href }) {
  return (
    <a
      href={href}
      className="flex items-center  gap-4 p-3 cursor-pointer rounded-lg hover:bg-blue-900 transition-all duration-200 group"
    >
      <span className="text-xl">{icon}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
    </a>
  );
}
