import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import crud from "../../conexiones/crud";
import swal from "sweetalert";
import ClienteModal from "./ClienteModal"; // Importar el modal

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Estado para manejar la visibilidad del modal
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Estado para almacenar el cliente a editar

  const cargarClientes = async () => {
    setIsLoading(true);
    try {
      const response = await crud.GET(`/api/clientes`);
      if (response?.clientes) {
        setClientes(response.clientes);
      } else {
        console.error("Respuesta de la API inválida:", response);
        swal({
          title: "Error",
          text: response.msg || "No se pudieron cargar los clientes.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      swal({
        title: "Error",
        text: "Ocurrió un error al cargar los clientes. Inténtelo más tarde.",
        icon: "error",
        button: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const buscarCliente = (e) => {
    setBusqueda(e.target.value);
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nit.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalOpen(true);
  };

  const cerrarModalCliente = () => {
    setModalOpen(false);
    setClienteSeleccionado(null);
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="min-h-screen bg-lime-200">
            <div className="bg-lime-200 px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <p className="text-gray-800 font-bold text-lg md:text-xl">
                GESTIÓN DE CLIENTES
              </p>
            </div>
            <div className="p-4">
              {/* Barra de búsqueda */}
              <div className="md:flex md:justify-between md:items-center text-gray-800">
                <div className="flex items-center rounded-md bg-white shadow shadow-gray-200 my-3 w-full md:w-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 ml-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    type="text"
                    className="pl-2 pr-6 py-2 outline-none text-gray-800 placeholder-gray-400 w-full md:w-96 rounded-md"
                    placeholder="Buscar: Ingrese la Cedula o NIT"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        buscarCliente();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-sm shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 px-4 py-3 border-b border-gray-200 text-gray-700 font-medium justify-items-center">
                  <div>Nombres</div>
                  <div>Cédula/NIT</div>
                  <div>Dirección</div>
                  <div>Ciudad</div>
                  <div>Teléfono</div>
                  <div>N° Compras</div>
                  <div>Acciones</div>
                </div>

                {isLoading ? (
                  <div className="px-4 py-4 text-gray-600">
                    Cargando clientes...
                  </div>
                ) : clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente, index) => (
                    <div
                      key={cliente._id || `cliente-${index}`}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 px-4 py-4 border-b border-gray-200 text-gray-600 items-center justify-items-center"
                    >
                      <div>{cliente.nombre}</div>
                      <div>{cliente.nit}</div>
                      <div>{cliente.direccion}</div>
                      <div>{cliente.ciudad}</div>
                      <div>{cliente.telefono}</div>
                      <div>{cliente.numeroCompras}</div>
                      <div className="flex gap-3">
                        <button
                          className="text-blue-400 p-1 hover:bg-gray-100 rounded-full"
                          onClick={() => abrirModalCliente(cliente)}
                        >
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-gray-600">
                    No hay clientes registrados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Renderizar el modal si está abierto */}
      {modalOpen && (
        <ClienteModal
          clienteState={clienteSeleccionado}
          changeModalCliente={cerrarModalCliente}
          actualizarClientes={cargarClientes}
        />
      )}
    </>
  );
};

export default ClientesPage;
