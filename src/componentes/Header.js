import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  //Se cierra seccion
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="px-4 py-5 bg-lime-400 border-b">
      <div className="lg:flex lg:justify-around md:flex md:justify-around">
        <div className="md-flex-col md:justify-between">
          <h1 className="text-2xl text-violet-600 font-black text-center mb-5 md-mb-0">
            "ADICC Dotaciones Institucionales"
          </h1>
          <h2 className="text-2xl text-violet-600 font-black text-center mb-5 md-mb-0">
            Panel de Administrador
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="submit"
            value="Cerrar Sesión"
            className="bg-violet-600 mb-5 w-full py-3 px-4 text-white uppercase font-bold rounded hover:cursor-pointer"
            onClick={cerrarSesion}
          />
        </div>
      </div>
    </header>
  );
};
export default Header;
