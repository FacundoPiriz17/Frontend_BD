import {
    LuLayoutDashboard,
    LuCalendarClock,
    LuDoorOpen,
    LuBan,
    LuStar,
    LuUserCog,
} from "react-icons/lu";
import { useState } from "react";

export default function SidebarAdmin() {
    const [currentPath, setCurrentPath] = useState("/stats");

    const menuItems = [
        { label: "Estadísticas", to: "/stats", icon: LuLayoutDashboard },
        { label: "Reservas", to: "/reservas", icon: LuCalendarClock },
        { label: "Salas", to: "/salas", icon: LuDoorOpen },
        { label: "Sanciones", to: "/sanciones", icon: LuBan },
        { label: "Reseñas", to: "/reseñas", icon: LuStar },
        { label: "Usuarios", to: "/usuarios", icon: LuUserCog },
    ];

    return (
        <div className="flex h-screen bg-slate-100">
            <aside className="bg-white border-r border-slate-200 shadow-lg flex flex-col py-6">
                <nav className="flex flex-col gap-2 px-3">
                    {menuItems.map(({ label, to, icon: Icon }) => {
                        const isActive = currentPath === to;

                        return (
                            <button
                                key={to}
                                onClick={() => setCurrentPath(to)}
                                className="group relative"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    width: '60px',
                                    height: '50px',
                                    borderRadius: '16px',
                                    color: isActive ? '#ffffff' : '#64748b',
                                    backgroundColor: isActive ? '#2563eb' : '#f8fafc',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.width = '160px';
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                    e.currentTarget.style.color = '#ffffff';
                                    const textSpan = e.currentTarget.querySelector('.label-text');
                                    if (textSpan) {
                                        textSpan.style.opacity = '1';
                                        textSpan.style.transform = 'translateX(0)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.width = '60px';
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = '#f8fafc';
                                        e.currentTarget.style.color = '#64748b';
                                    } else {
                                        e.currentTarget.style.backgroundColor = '#2563eb';
                                        e.currentTarget.style.color = '#ffffff';
                                    }
                                    const textSpan = e.currentTarget.querySelector('.label-text');
                                    if (textSpan) {
                                        textSpan.style.opacity = '0';
                                        textSpan.style.transform = 'translateX(-10px)';
                                    }
                                }}
                            >
                <span
                    className="flex items-center justify-center"
                    style={{
                        minWidth: '60px',
                        height: '50px',
                    }}
                >
                  <Icon size={22} />
                </span>

                                <span
                                    className="label-text"
                                    style={{
                                        marginLeft: '8px',
                                        fontSize: '14px',
                                        whiteSpace: 'nowrap',
                                        opacity: 0,
                                        transform: 'translateX(-10px)',
                                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                                    }}
                                >
                  {label}
                </span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
}