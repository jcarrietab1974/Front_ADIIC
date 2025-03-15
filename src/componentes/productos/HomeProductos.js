import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import crud from "../../conexiones/crud";
import ViewProductos from "./ViewProductos";

const HomeProductos = () => {
  const navigate = useNavigate();
  const { idCategoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(null); // Estado para almacenar la categoría
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/");
      }
    };
    autenticarUsuario();
  }, [navigate]);

  useEffect(() => {
    if (!idCategoria) {
      console.error("ID de categoría no recibido");
      return;
    }

    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Obtener productos por categoría
        const productosResponse = await crud.GET(
          `/api/productos/porcategoria/${idCategoria}`
        );
        setProductos(Array.isArray(productosResponse) ? productosResponse : []);

        // Obtener información de la categoría
        const categoriaResponse = await crud.GET(
          `/api/categorias/${idCategoria}`
        );
        setCategoria(categoriaResponse?.categoria || null);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setProductos([]);
        setCategoria(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idCategoria]);

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar idCategoria={idCategoria} className="self-start" />
        <main className="flex-1 py-4">
          <div className="mt-2 flex justify-center">
            <p className="text-lime-900 font-bold text-2xl md:text-3xl tracking-tight italic text-center md:text-left">
              Productos de {categoria?.nombre || "Categoría"}
            </p>
          </div>
          <div className="bg-lime-500 shadow mt-5 rounded-lg w-4/5 mx-auto my-2 p-4">
            {loading ? (
              <p className="text-center text-white">Cargando productos...</p>
            ) : productos.length > 0 ? (
              productos.map((producto) => (
                <ViewProductos key={producto._id} producto={producto} />
              ))
            ) : (
              <p className="text-center text-white">
                No hay productos disponibles.
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default HomeProductos;
