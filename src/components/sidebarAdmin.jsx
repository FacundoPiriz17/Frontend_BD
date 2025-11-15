export default function SidebarAdmin() {
    return (
        <aside className="
            w-[20%]
            min-h-screen
            ml-4 mt-4 mb-4
            bg-blue-950
            text-white
            p-4
            border border-blue-900
            rounded-md
            flex flex-col gap-2
        ">
            <div className="pb-2 mb-2"></div>

            <a href="/stats"       className="block p-3 rounded-lg hover:bg-blue-900 transition">Estadísticas</a>
            <a href="/reservas"    className="block p-3 rounded-lg hover:bg-blue-900 transition">Gestionar reservas</a>
            <a href="/salas"       className="block p-3 rounded-lg hover:bg-blue-900 transition">Gestionar salas</a>
            <a href="/sanciones"   className="block p-3 rounded-lg hover:bg-blue-900 transition">Gestionar sanciones</a>
            <a href="/reseñas"     className="block p-3 rounded-lg hover:bg-blue-900 transition">Gestionar reseñas</a>
            <a href="/usuarios"    className="block p-3 rounded-lg hover:bg-blue-900 transition">Gestionar usuarios</a>
        </aside>
    );
}
