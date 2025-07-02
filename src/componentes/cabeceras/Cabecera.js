import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import crud from "../../conexiones/crud";
import swal from "sweetalert";
import CabeceraModal from "./CabeceraModal";
import crearCabecera from "./crearCabecera";

const CabeceraPage = () => {
  const [cabeceras, setCabeceras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [selectedCabecera, setSelectedCabecera] = useState(null);

  useEffect(() => {
    fetchCabeceras("/api/cabecera");
  }, []);

  const fetchCabeceras = async (url) => {
    setIsLoading(true);
    try {
      const response = await crud.GET(url);
      if (response) {
        setCabeceras(Array.isArray(response) ? response : [response]);
      } else {
        swal("Error", "No se pudieron cargar las cabeceras.", "error");
      }
    } catch (error) {
      swal("Error", "Error al cargar las cabeceras.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar cabeceras dinámicamente según el NIT
  const cabecerasFiltradas = cabeceras.filter((cabecera) =>
    cabecera.nit.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="min-h-screen bg-lime-200">
            {/* Header */}
            <div className="bg-lime-200 px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <p className="text-gray-800 font-bold text-lg md:text-xl">
                GESTIÓN DE CABECERAS
              </p>
            </div>
            {/* Contenido Principal */}
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
                    placeholder="Buscar: Ingrese el NIT"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        cabecerasFiltradas();
                      }
                    }}
                  />
                </div>

                {/* Botón "Agregar" */}
                <button
                  className="my-3 md:mt-0 flex items-center gap-3 hover:bg-lime-500 px-3 py-2 rounded-xl font-bold"
                  onClick={() =>
                    crearCabecera(() => fetchCabeceras("/api/cabecera"))
                  }
                >
                  Agregar Cabecera
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-9 h-9"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabla de Cabeceras */}
            <div className="bg-white rounded-sm shadow-sm">
              {/* Encabezados de la tabla */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 px-4 py-3 border-b border-gray-200 text-gray-700 font-medium justify-items-center">
                <div>Sucursal</div>
                <div>Nit</div>
                <div>Dirección</div>
                <div>Teléfono</div>
                <div>Email</div>
                <div>Acciones</div>
              </div>

              {/* Datos de las cabeceras */}
              {isLoading ? (
                <div className="px-4 py-4 text-gray-600">
                  Cargando cabeceras...
                </div>
              ) : cabecerasFiltradas.length > 0 ? (
                cabecerasFiltradas.map((cabecera) => (
                  <div
                    key={cabecera._id}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 px-4 py-4 border-b border-gray-200 text-gray-600 items-center justify-items-center"
                  >
                    <div>{cabecera.local}</div>
                    <div>{cabecera.nit}</div>
                    <div>{cabecera.direccion}</div>
                    <div>{cabecera.telefono}</div>
                    <div>{cabecera.email}</div>
                    <div className="flex gap-3">
                      <button
                        className="text-blue-400 p-1 hover:bg-gray-100 rounded-full"
                        onClick={() => setSelectedCabecera(cabecera)}
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-600">
                  No se encontraron resultados.
                </div>
              )}
            </div>

            {selectedCabecera && (
              <CabeceraModal
                cabeceraState={selectedCabecera}
                changeModalCabecera={() => setSelectedCabecera(null)}
                actualizarCabeceras={() => fetchCabeceras("/api/cabecera")}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CabeceraPage;
