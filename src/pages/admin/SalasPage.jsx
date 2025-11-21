import { useAuth } from "../../contexts/AuthContext";
import SidebarAdmin from "../../components/sidebarAdmin.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api.js";
import ModalEliminar from "../../components/ModalEliminar.jsx";
import ModalAgregarSala from "../../components/ModalAgregarSala.jsx";
import ModalModificarSala from "../../components/ModalModificarSala.jsx";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

export default function SalasPage() {
  const { token } = useAuth();
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalModificar, setModalModificar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [edificios, setEdificios] = useState([]);
  const [edificio, setEdificio] = useState("");
  const [input, setInput] = useState("");
  const [disponibilidad, setDisponibilidad] = useState(true);

  const fetchSalas = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/salas/all`, { token });
      setSalas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, [token]);

  const fetchSalasDisp = async () => {
    try {
      const data = await apiFetch(`/salas/disponibles`, { token });
      setSalas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEdificio = async () => {
      try {
        const data = await apiFetch("/edificios/todos", { token });
        setEdificios(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEdificio();
  }, [token]);

  const fetchSala = async (nombre_sala) => {
    setLoading(true);
    try {
      const data = await apiFetch(
        `/salas/buscar/${encodeURIComponent(nombre_sala)}`,
        { token }
      );
      setSalas(data);
    } catch {
      setSalas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalasEdificio = async (edificio) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/salas/${edificio}`, { token });
      setSalas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key == "Enter") {
      handleBuscarSala();
    }
    return;
  };

  const handleBuscarSala = async () => {
    if (input.trim() === "" && edificio === "") {
      fetchSalas();
      return;
    }
    if (input.trim() === "" && edificio !== "") {
      fetchSalasEdificio(edificio);
      return;
    }
    if (input.trim() !== "") {
      fetchSala(input);
      return;
    }
  };

  const handleAgregarSala = async (sala) => {
    try {
      await apiFetch("/salas/registrar", {
        method: "POST",
        body: sala,
        token,
      });
      fetchSalas();
      setModalAgregar(false);
    } catch (err) {
      alert(`Error para agregar sala: ${err.message}`);
    }
  };

  const handleModificarSala = async (datosActualizados) => {
    try {
      await apiFetch(
        `/salas/${encodeURIComponent(salaSeleccionada.nombre_sala)}/${
          salaSeleccionada.edificio
        }`,
        {
          method: "PUT",
          body: datosActualizados,
          token,
        }
      );
      fetchSalas();
      setModalModificar(false);
      setSalaSeleccionada(null);
    } catch (err) {
      alert(`Error al modificar sala: ${err.message}`);
    }
  };

  const handleEliminarSala = async () => {
    try {
      await apiFetch(
        `/salas/${encodeURIComponent(salaSeleccionada.nombre_sala)}/${
          salaSeleccionada.edificio
        }`,
        {
          method: "DELETE",
          token,
        }
      );
      fetchSalas();
      setModalEliminar(false);
      setSalaSeleccionada(null);
    } catch (err) {
      alert(`Error al eliminar sala: ${err.message}`);
    }
  };

  const abrirModalModificar = (sala) => {
    setSalaSeleccionada(sala);
    setModalModificar(true);
  };

  const abrirModalEliminar = (sala) => {
    setSalaSeleccionada(sala);
    setModalEliminar(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-xl text-blue-800">Cargando Salas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 h-full">
        <SidebarAdmin />

        <div className="flex-1 overflow-auto py-8 px-6">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Listado de Salas
          </h2>

          <div className="fixed right-6 gap">
            <button
              onClick={() => setModalAgregar(true)}
              className=" mr-1 bg-blue-700 text-white px-6 py-4 rounded-lg shadow-blue-500  hover:bg-blue-800 shadow mb-6"
            >
              + Añadir Sala
            </button>
            <button
              onClick={() => {
                setDisponibilidad(!disponibilidad);
                if (disponibilidad) {
                  fetchSalasDisp();
                } else {
                  fetchSalas();
                }
              }}
              className="ml-1 bg-blue-700 text-white px-6 py-4 rounded-lg shadow-blue-500  hover:bg-blue-800 shadow mb-6"
            >
              {disponibilidad ? "Solo Disponibles" : "Mostar Todo"}
            </button>
          </div>
          <div className="flex justify-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Buscar Sala por nombre..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-4 py-2  border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={edificio}
              onChange={(e) => {
                const nuevoEdificio = e.target.value;
                setEdificio(nuevoEdificio);

                if (nuevoEdificio === "") {
                  fetchSalas();
                } else {
                  fetchSalasEdificio(nuevoEdificio);
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los edificios</option>
              {edificios.map((edificio) => (
                <option
                  key={edificio.nombre_edificio}
                  value={edificio.nombre_edificio}
                >
                  {edificio.nombre_edificio}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleBuscarSala()}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 shadow transition font-semibold"
            >
              Filtrar
            </button>

            <button
              onClick={() => {
                setInput("");
                fetchSalas();
                setEdificio("");
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 shadow transition"
            >
              Limpiar Filtro
            </button>
          </div>

          <div className="flex flex-col gap-4 px-4">
            {salas.length === 0 ? (
              <div className="col-span-full text-center text-gray-600 text-lg py-10">
                No hay Salas Registradas.
              </div>
            ) : (
              salas.map((sala) => (
                <div
                  key={`${sala.nombre_sala}-${sala.edificio}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-800">
                        {sala.nombre_sala}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Edificio: {sala.edificio}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {sala.disponible ? (
                        <div>
                          <FaCheckCircle
                            className="text-blue-600 text-xl"
                            title="Disponible"
                          />
                          <p>Disponible</p>
                        </div>
                      ) : (
                        <div>
                          <FaTimesCircle
                            className="text-red-600 text-xl"
                            title="No disponible"
                          />
                          <p>Ocupada</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Capacidad:</span>{" "}
                      {sala.capacidad} personas
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Tipo:</span>{" "}
                      {sala.tipo_sala}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Puntaje:</span>{" "}
                      {sala.puntaje}/5 ⭐
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => abrirModalModificar(sala)}
                      className="flex-1 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => abrirModalEliminar(sala)}
                      className="flex-1 bg-white text-blue-800 border-2 border-blue-800 p-6 w-5 px-4 py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer/>

      <ModalAgregarSala
        open={modalAgregar}
        onClose={() => setModalAgregar(false)}
        onConfirm={handleAgregarSala}
      />

      <ModalModificarSala
        open={modalModificar}
        onClose={() => {
          setModalModificar(false);
          setSalaSeleccionada(null);
        }}
        onConfirm={handleModificarSala}
        sala={salaSeleccionada}
      />

      <ModalEliminar
        open={modalEliminar}
        onClose={() => {
          setModalEliminar(false);
          setSalaSeleccionada(null);
        }}
        onConfirm={handleEliminarSala}
        objeto={`la sala "${salaSeleccionada?.nombre_sala}" del edificio ${salaSeleccionada?.edificio}`}
      />
    </div>
  );
}
