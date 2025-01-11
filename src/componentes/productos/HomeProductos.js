import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
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
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 justify-items-center">
          <div className="mt-2 flex justify-center">
            <h1
              className="inline bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
                        bg-clip-text text-4xl tracking-tight text-transparent text-center"
            >
              Lista de Productos
            </h1>
          </div>
          <div className="p-7">
            <Link
              to={`/crear-producto/${idCategoria}`}
              className="bg-violet-600 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg"
            >
              Crear Producto
            </Link>
          </div>

          <div className="bg-gray-600 shadow mt-5 rounded-lg w-4/5 justify-items-center">
            {productos &&
              productos.map((producto) => (
                <ViewProductos key={producto._id} producto={producto} />
              ))}
            ;
          </div>
        </main>
      </div>
    </>
  );
};
export default HomeProductos;
