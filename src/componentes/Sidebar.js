import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ idCategoria = null }) => {
  const linkStyles =
    "bg-lime-500 w-full p-3 text-white uppercase font-bold text-center rounded-lg flex justify-center mt-3 hover:bg-lime-700 transition duration-300";

  return (
    <aside className="md:w-60 lg:w-60 px-6 py-6 bg-lime-200 flex flex-col items-center min-h-[200px]">
      <p className="text-xl font-bold bg-clip-text text-lime-800 italic mb-2 text-center">
        Panel de Administrador
      </p>

      <Link to="/admin" className={linkStyles} aria-label="Ir a categorías">
        Categorías
      </Link>

      <Link
        to="/crear-categoria"
        className={linkStyles}
        aria-label="Crear nueva categoría"
      >
        Crear Categoría
      </Link>

      {idCategoria ? (
        <Link
          to={`/crear-producto/${idCategoria}`}
          className={linkStyles}
          aria-label="Crear nuevo producto"
        >
          Crear Producto
        </Link>
      ) : (
        <button
          className={`${linkStyles} bg-lime-300 cursor-not-allowed opacity-50`}
          disabled
          aria-label="Crear Producto deshabilitado"
        >
          Crear Producto
        </button>
      )}

      <Link
        to="/crear-cuenta"
        className={linkStyles}
        aria-label="Crear nueva cuenta"
      >
        Crear Cuenta
      </Link>

      <Link to="/cliente" className={linkStyles} aria-label="Cliente">
        Cliente
      </Link>

      <Link to="/cabecera" className={linkStyles} aria-label="Cabecera">
        Cabeceras
      </Link>

      <Link to="/factura" className={linkStyles} aria-label="Cabecera">
        Facturas
      </Link>
    </aside>
  );
};

export default Sidebar;
