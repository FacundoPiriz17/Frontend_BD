import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api.js";

export default function ModalEditarUsuario({ open, onClose, usuario, token, onConfirm }) {
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        rol: "",
        contrasena: ""
    });

    useEffect(() => {
        if (usuario) {
            setForm({
                nombre: usuario.nombre || "",
                apellido: usuario.apellido || "",
                email: usuario.email || "",
                rol: usuario.rol || "",
                contrasena: ""
            });
        } else {
            setForm({
                nombre: "",
                apellido: "",
                email: "",
                rol: "",
                contrasena: ""
            });
        }
    }, [usuario]);

    if (!open) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await apiFetch(`/login/usuarios/${usuario.ci}`, {
                method: "PUT",
                body: form,
                token
            });
            onConfirm();
            onClose();
        } catch (err) {
            console.error("Error actualizando usuario:", err);
            console.log(usuario.ci);

            alert("No se pudo actualizar el usuario");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">{usuario ? "Editar Usuario" : "Añadir Usuario"}</h2>

                <div className="flex flex-col gap-3">
                    <p>Nombre:</p>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <p>Apellido:</p>
                    <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <p>Email:</p>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <p>Rol:</p>
                    <select
                        name="rol"
                        value={form.rol}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="Participante">Participante</option>
                        <option value="Funcionario">Funcionario</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                    Contraseña:
                    <input
                        type="password"
                        name="contrasena"
                        placeholder="Contraseña "
                        value={form.contrasena}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border hover:bg-gray-100 transition">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
