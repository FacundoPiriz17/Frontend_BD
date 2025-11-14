import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {RiEyeCloseLine, RiEyeFill} from "react-icons/ri";
import ucuRoomsLogo from "../assets/ucurooms.png";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const passwordRef = useRef(null);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, contrasena);
        if (result.ok) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            console.log(storedUser.rol);

            switch (storedUser.rol) {
                case "Participante":
                    navigate("/participante");
                    break;
                case "Funcionario":
                    navigate("/funcionario");
                    break;
                case "Administrador":
                    navigate("/admin");
                    break;
                default:
                    navigate("/unauthorized");
            }
        } else {
            setError(result.error || "Usuario y/o contraseña Inválidos");
        }
    };

    const handleEmailKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            passwordRef.current.focus();
        }
    };

    return (
        <div className="relative flex h-screen justify-center items-center overflow-hidden bg-[url(https://i.ytimg.com/vi/I2_PamgttyQ/maxresdefault.jpg)] bg-cover bg-center">

            <div className="absolute inset-0 bg-[url('https://i.ytimg.com/vi/I2_PamgttyQ/maxresdefault.jpg')] bg-cover bg-center blur-sm scale-105"></div>

            <div className={`relative bg-white backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 z-10 transform transition-all duration-700 ease-out
            ${
                visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
            }
            `}
            >

                <div className="flex justify-center mb-4">
                    <img
                        src={ucuRoomsLogo}
                        alt="Logo de Ucu Rooms"
                        className="w-24 h-24 object-contain sm:w-28 sm:h-28 drop-shadow-md"
                    />
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-blue-900 drop-shadow-md">
                    Iniciar sesión
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        ref={passwordRef}
                        type="email"
                        placeholder="Correo institucional"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        className="w-full border border-gray-400 p-2 rounded placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                        required
                    />
                    <div className="relative">
                        <input
                            ref={passwordRef}
                            type={mostrarContrasena ? "text" : "password"}
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            onKeyDown={handleEmailKeyDown}
                            className="w-full border border-gray-400 p-2 rounded placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="absolute right-3 top-2.5 text-gray-600 hover:text-blue-500 transition"
                        >
                            {mostrarContrasena ? (
                                <RiEyeFill className="text-blue-800 text-xl" />
                            ) : (
                                <RiEyeCloseLine className="text-gray-600 text-xl" />
                            )}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
