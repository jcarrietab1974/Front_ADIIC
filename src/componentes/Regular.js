import React, { useEffect, useState } from "react";
import crud from "../conexiones/crud";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Regular = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
    };
    autenticarUsuario();
  }, [navigate]);

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
          {" "}
          {/* Contenedor para centrar el texto */}
          <h1 className="text-lime-900 font-bold text-3xl tracking-tight text-center mb-6 italic">
            Panel de vendedores
          </h1>
        </div>

        {/* Sección de Categorías */}
        <section className="bg-lime-300 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-lime-900 mb-4">CATEGORIAS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorias.map((category) => (
              <a
                key={category.nombre}
                href={category.href}
                className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="relative h-64">
                  {" "}
                  {/* Altura fija para las imágenes */}
                  <img
                    src={category.imagen}
                    alt={category.nombre}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
                  {/* Oscurecimiento de la imagen */}
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">
                    {category.nombre}
                  </h3>
                  <Link
                    className="bg-lime-500 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg flex justify-center"
                    to={`/regproducto/${category._id}`} // Pasar el ID de la categoría en la URL
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
