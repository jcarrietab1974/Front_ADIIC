import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import ViewProductos from "./ViewProductos";

const HomeProductos = () => {
  const navigate = useNavigate();
  const { idCategoria } = useParams();

  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    const response = await crud.GET(
      `/api/productos/porcategoria/${idCategoria}`
    );
    setProductos(response);
  };

  console.log(productos);

  useEffect(() => {
    cargarProductos();
  }, []); //Para que solo se ejecute una vez

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
