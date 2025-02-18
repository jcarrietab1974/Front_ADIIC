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
    <header className="px-1 py-1 bg-white border-b">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
        
        {/* Imagen a la izquierda */}
        <div className="flex-shrink-0 mb-2 mx-10 md:mb-0">
          <img
            src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1732987889/logo-dotac-1-337x133_zp5dzx.png"
            alt="Descripción"
            className="w-36 md:w-36 lg:w-48" // Ajustar el tamaño de la imagen según el tamaño de pantalla
          />
        </div>

        {/* Título centrado */}
        <h2 className="text-3xl text-black font-black text-center flex-grow mx-1 mb-2 md:mb-0"> {/* Reducir margen horizontal */}
          Panel de Administrador
        </h2>

        {/* Botón a la derecha */}
        <div className="flex-shrink-0 mx-10">
          <input
            type="submit"
            value="Cerrar Sesión"
            className="bg-lime-500 w-full md:w-auto py-2 px-4 text-white uppercase font-bold rounded hover:cursor-pointer"
            onClick={cerrarSesion}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;