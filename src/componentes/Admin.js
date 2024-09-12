import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {

  const navigate = useNavigate();

  //Se crea una ruta segura

  useEffect (() => {

    const autenticarUsuario = async () =>{
      const token = localStorage.getItem('token');
    // console.log(token);
    if(!token){
      navigate("/login"); 
    };

    }
     autenticarUsuario()
  },[]); //[] Se ejecuta solo una vez


//Se cierra seccion

  const cerrarSesion = () => {

    localStorage.removeItem("token");
    navigate("/");

  }

  return (
    <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
      <div className="md:w-2/3 lg:w-3/5">
        <h1
          className=" colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
         bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          "ADIIC Dotaciones Institucionales"
        </h1>

        <input
          type="submit"
          value="Serrar sesión"
          className="bg-violet-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
          onClick={cerrarSesion}
        />
        
        

        <h2 className="colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200 bg-clip-text font-display text-4xl tracking-tight text-transparent text-center">
          Panel de Administrador


        </h2>
      </div>
    </main>
  );
};

export default Admin;
