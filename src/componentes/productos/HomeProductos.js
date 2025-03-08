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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Inicializa en false

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return; // Evita que el resto del efecto se ejecute
    }
    setIsAuthenticated(true);
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return; // No cargar productos si no está autenticado

    const cargarProductos = async () => {
      try {
        const response = await crud.GET(
          `/api/productos/porcategoria/${idCategoria}`
        );
        setProductos(response);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, [idCategoria, isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Evita mostrar la UI hasta que se resuelva la autenticación
  }

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar idCategoria={idCategoria} className="self-start" />
        <main className="flex-1 py-4">
          <div className="mt-2 flex justify-center">
            <p className="text-lime-900 font-bold text-4xl tracking-tight text-center mb-6 italic">
              Lista de Productos
            </p>
          </div>
          <div className="bg-lime-500 shadow mt-5 rounded-lg w-4/5 mx-auto my-2 p-4">
            {productos.length > 0 ? (
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
