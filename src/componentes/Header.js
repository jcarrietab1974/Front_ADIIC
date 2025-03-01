import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Se cierra sección
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="px-1 py-1 bg-lime-200 border-b">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
        {/* Imagen a la izquierda */}
        <div className="flex-shrink-0 mb-2 mx-10 md:mb-0 justify-center">
          <img
            src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1739396784/Logo_2_dpgrjs.png"
            alt="Descripción"
            className="w-36 md:w-36 lg:w-48" // Ajustar el tamaño de la imagen según el tamaño de pantalla
          />
        </div>

        {/* Título centrado */}
        <div>
          <h1 className="text-lime-900 font-bold text-4xl tracking-tight text-center italic">
            {" "}
            {/* Reducir margen horizontal */}
            Dotaciones Institucionales
          </h1>

          <p className="text-lime-900 font-bold text-2xl tracking-tight text-center italic">
            {" "}
            {/* Reducir margen horizontal */}
            Asesoria en Dotaciones Institucionales e Imagen Coorporativa
          </p>
        </div>

        {/* Botón a la derecha */}
        <div className="flex-shrink-0 mx-10">
          <input
            type="submit"
            value="Cerrar Sesión"
            className="bg-lime-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-lime-700 transition duration-300 mt-4 md:mt-0"
            onClick={cerrarSesion}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
