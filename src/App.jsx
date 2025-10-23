import {useEffect, useState} from "react";

function useFetchUsers() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const req = await fetch("http://127.0.0.1:5000/login/usuarios");
                if (req.ok) {
                    const data = await req.json();
                    setUsuarios(data);
                } else {
                    console.error("Error en la respuesta:", req.status);
                }
            } catch (err) {
                console.error("Error al conectar con el backend:", err);
            }
        }
        fetchUsers();
    }, []);

    return usuarios;
}
function App() {
    const users = useFetchUsers();

    return (
        <>
            {users.length > 0 ? (
                users.map((usuario) => (
                    <div className="p-2 border rounded-lg" key={usuario.ci}>
                        <span>{usuario.nombre}</span>{" "}
                        <span>{usuario.apellido}</span>{" "}
                        <span>{usuario.ci}</span>{" "}
                        <span>{usuario.email}</span>{" "}
                        <span>{usuario.rol}</span>
                    </div>
                ))
            ) : (
                <p>No hay usuarios registrados.</p>
            )}
        </>
    );
}

export default App
