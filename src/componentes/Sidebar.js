import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="md:w-60 lg:w-60 px-6 py-4 bg-lime-300">
      <Link
        className="bg-lime-800 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg flex justify-center"
        to={"/crear-categoria"}
      >
        Crear Categoria
      </Link>
  
     <div className="py-10">
      <Link
        className="bg-lime-800 w-full p-3 text-white uppercase font-bold mt-5 text-center rounded-lg flex justify-center"
        to={"/admin"}
      >
        Admin Categoria
      </Link>

      </div>




    </aside>
  );
};
export default Sidebar;
