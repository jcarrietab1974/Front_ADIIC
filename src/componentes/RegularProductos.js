import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import { Link, useParams } from "react-router-dom";
import crud from "../conexiones/crud";

const RegularProductos = () => {
  const { id } = useParams(); // Capturar el ID de la categoría desde la URL
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener detalles de la categoría seleccionada
      const categoriaResponse = await crud.GET(`/api/categorias/${id}`);
      setCategoria(categoriaResponse.categoria || null);

      // Obtener productos de la categoría seleccionada (AJUSTE DE ENDPOINT)
      const productosResponse = await crud.GET(`/api/productos/porcategoria/${id}`);
      
      if (productosResponse && Array.isArray(productosResponse.productos)) {
        setProductos(productosResponse.productos);
      } else {
        console.error("Respuesta inesperada de la API:", productosResponse);
        setProductos([]);
      }
    } catch (error) {
      setError(error);
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar datos. Por favor, inténtelo de nuevo más tarde.
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full p-4 md:p-6 lg:p-8 bg-lime-200 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-lime-900 font-bold text-2xl md:text-3xl tracking-tight italic text-center md:text-left">
            Productos de {categoria?.nombre || "Categoría"}
          </h1>
          <Link
            to="/regular"
            className="bg-lime-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-lime-700 transition duration-300 mt-4 md:mt-0"
          >
            Volver a Categorías
          </Link>
        </div>

        {/* Sección de Productos */}
        <section className="bg-lime-500 p-6 rounded-lg shadow-md">
          {productos.length === 0 ? (
            <p className="text-white text-center">
              No hay productos disponibles en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <div
                  key={producto._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative h-64">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {producto.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Stock: {producto.stock}
                    </p>
                    <p className="text-gray-900 font-semibold mt-2">
                      ${producto.precio}
                    </p>
                    <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default RegularProductos;
