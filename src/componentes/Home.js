import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import crud from "../conexiones/crud";

const Home = () => {
  const [categoria, setCategoria] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState(null);
  const [errorProductos, setErrorProductos] = useState(null);

  const cargarCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const response = await crud.GET(`/api/categorias/`);
      setCategoria(response.categoria || []); // Manejo de respuesta vacía
    } catch (error) {
      setErrorCategorias(error);
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const cargarProductos = async () => {
    setLoadingProductos(true);
    try {
      const response = await crud.GET(`/api/productos/`);
      setProductos(response.productos || []); // Manejo de respuesta vacía
    } catch (error) {
      setErrorProductos(error);
      console.error("Error al cargar productos:", error);
    } finally {
      setLoadingProductos(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  if (loadingCategorias || loadingProductos) {
    return <div className="text-center py-8">Cargando...</div>; // Indicador de carga centralizado
  }

  if (errorCategorias || errorProductos) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar datos. Por favor, inténtelo de nuevo más tarde.
      </div>
    );
  }

  return (
    <div
      className="bg-[url(https://res.cloudinary.com/dv84nv8y0/image/upload/v1738628244/Dise%C3%B1o_sin_t%C3%ADtulo_af8ore.png)] 
    bg-cover bg-center bg-no-repeat min-h-screen w-full flex items-center justify-center"
    >
      <main className="flex flex-col items-center justify-center w-full p-4 md:p-6 lg:p-8 text-center bg-gradient-to-r from-white">
        <img
          src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1739396784/Logo_2_dpgrjs.png"
          alt="Descripción"
          className="w-3xs items-center justify-center"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-800 via-lime-900 to-lime-950 mb-2">
          Dotaciones Institucionales
        </h1>
        <h3 className="text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-lime-800 via-lime-900 to-lime-950 mb-4">
          Asesoria en Dotaciones Institucionales e Imagen Corporativa
        </h3>
        <Link
          to={"/login"}
          className="inline-block px-6 py-3 bg-lime-700 text-white font-medium rounded hover:bg-lime-500 transition duration-300"
        >
          Iniciar Sesión
        </Link>
      </main>
    </div>
  );
};

export default Home;
