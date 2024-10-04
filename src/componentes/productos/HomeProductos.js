import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";

const HomeProductos = () => {
  const navigate = useNavigate();

  const { idCategoria } = useParams();

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <div className="mt-2 flex justify-center">
            <h1
              className="inline bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
                        bg-clip-text text-4xl tracking-tight text-transparent text-center"
            >
              Lista de Productos
            </h1>
          </div>
          <div className="p-10">
            <Link
              to={`/crear-producto/${idCategoria}`}
              className="bg-violet-600 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg"
            >
              Crear Producto
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};
export default HomeProductos;
