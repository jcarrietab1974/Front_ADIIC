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

      // Obtener productos de la categoría seleccionada
      const productosResponse = await crud.GET(
        `/api/productos/porcategoria/${id}`
      );

      console.log("Respuesta completa de la API:", productosResponse);

      if (!Array.isArray(productosResponse)) {
        console.error("Respuesta inesperada de la API:", productosResponse);
        setProductos([]);
      } else {
        setProductos(productosResponse); // ✅ Asignar directamente el array de productos
      }
    } catch (error) {
      setError(error.message);
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
          <p className="text-lime-900 font-bold text-2xl md:text-3xl tracking-tight italic text-center md:text-left">
            Productos de {categoria?.nombre || "Categoría"}
          </p>
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
                  className="bg-lime-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative h-64">
                    <img
                      src={producto.imagen}
                      alt="imagen-producto"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-lg text-black break-words font-bold">
                      {producto.nombre}
                    </p>
                    <p className="mb-1 text-sm text-black break-words font-bold">
                      {producto.descripcion}
                    </p>
                    <p className="mb-1 text-sm text-black break-words font-bold">
                      Stock: {producto.stock}
                    </p>
                    <p className="mb-1 text-sm text-black break-words font-bold">
                      Precio: ${producto.precio}
                    </p>
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
