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
        return <div className="text-center py-8 text-red-500">Error al cargar datos. Por favor, inténtelo de nuevo más tarde.</div>;
    }

  return (
    <main className="flex-1 w-full p-4 md:p-6 lg:p-8">
      <div className="text-center mb-8"> {/* Contenedor para centrar el texto */}
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-700 to-pink-500 mb-2">
          ADIIC Dotaciones Institucionales
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-700 to-pink-500 mb-4">
          Home de clientes
        </h2>
        <Link
          to={"/login"}
          className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-300"
        >
          Iniciar sesión
        </Link>
      </div>

      {/* Sección de Categorías */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">CATEGORIAS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoria.map((category) => (
            <a
              key={category.nombre}
              href={category.href}
              className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="relative h-64"> {/* Altura fija para las imágenes */}
                <img
                  src={category.imagen}
                  alt={category.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-30"></div> {/* Oscurecimiento de la imagen */}
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{category.nombre}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Sección de Productos */}
      <section className="bg-gray-500 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">PRODUCTOS ADQUIRIDOS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-64">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.nombre}</h3>
                <p className="text-gray-600 text-sm mt-1">Stock: {product.stock}</p>
                <p className="text-gray-900 font-semibold mt-2">${product.precio}</p>
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;