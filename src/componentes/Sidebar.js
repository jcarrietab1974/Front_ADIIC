import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="md:w-60 lg:w-60 px-6 py-2 bg-white max-h-full">
      <Link
        className="bg-lime-500 w-full p-3 text-white uppercase font-bold mt-3 text-center rounded-lg flex justify-center"
        to={"/admin"}
      >
        Admin Categoria
      </Link>

      <Link
        className="bg-lime-500 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg flex justify-center"
        to={"/crear-categoria"}
      >
        Crear Categoria
      </Link>

      <Link
        className="bg-lime-500 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg flex justify-center"
        to={"/crear-cuenta"}
      >
        Crear Cuenta
      </Link>
    </aside>
  );
};
export default Sidebar;
