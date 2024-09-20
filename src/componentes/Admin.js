import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Admin = () => {
  const navigate = useNavigate();

  //Se crea una ruta segura
  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      // console.log(token);
      if (!token) {
        navigate("/login");
      }
    };
    autenticarUsuario();
  }, [navigate]); //[] Se ejecuta solo una vez

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <h1
          className=" colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
         bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          Lista de categorias
        </h1>
      </div>
    </>
  );
};
export default Admin;
