import React, { useEffect, useState } from "react";
import crud from "../conexiones/crud";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import FacturaModal from "../componentes/facturas/FacturaModal";

const Regular = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [facturas, setFacturas] = useState([]);

  // Verificar autenticación antes de cargar datos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return; // Detener la ejecución si el usuario no está autenticado
    }
  }, [navigate]);

  useEffect(() => {
    fetchFacturas("/api/factura");
  }, []);

  const fetchFacturas = async (url) => {
    setIsLoading(true);
    try {
      const response = await crud.GET(url);
      if (response) {
        setFacturas(Array.isArray(response) ? response : [response]);
      } else {
        swal("Error", "No se pudieron cargar las cabeceras.", "error");
      }
    } catch (error) {
      swal("Error", "Error al cargar las cabeceras.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await crud.GET(`/api/categorias`);
      if (response && response.categoria) {
        setCategorias(response.categoria);
      } else {
        console.error("Respuesta de la API inválida:", response);
        swal(
          "Error",
          "No se pudieron cargar las categorías. Contacte al administrador.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
      swal(
        "Error",
        "Ocurrió un error al cargar las categorías. Inténtelo nuevamente más tarde.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 w-full p-4 md:p-6 lg:p-8 bg-lime-200">
        <div className="text-center mb-8">
          <p className="text-lime-900 font-bold text-3xl tracking-tight text-center mb-6 italic">
            Panel de vendedores
          </p>
        </div>

        {/* Botón "Agregar" */}
        <button
          className="my-3 md:mt-0 flex items-center gap-3 hover:bg-lime-500 px-3 py-2 rounded-xl font-bold"
          onClick={() => FacturaModal(() => fetchFacturas("/api/factura"))}
        >
          Facturar Venta
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

        {/* Sección de Categorías */}
        <section className="bg-lime-300 p-6 rounded-lg shadow-md mb-8">
          <p className="text-2xl font-bold text-lime-900 mb-4">CATEGORIAS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorias.map((category) => (
              <a
                key={category._id}
                href={category.href}
                className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={category.imagen}
                    alt={category.nombre}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">
                    {category.nombre}
                  </h3>
                  <Link
                    className="bg-lime-500 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg flex justify-center"
                    to={`/regproducto/${category._id}`}
                  >
                    Productos
                  </Link>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Regular;
