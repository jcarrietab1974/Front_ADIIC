import React, { useEffect, useState } from "react";
import crud from "../conexiones/crud";
import Login from "./Login";

const Home = () => {
  const [data, setData] = useState({
    categorias: [],
    productos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [categoriasRes, productosRes] = await Promise.all([
          crud.GET(`/api/categorias/`),
          crud.GET(`/api/productos/`),
        ]);

        setData({
          categorias: categoriasRes.categoria || [],
          productos: productosRes.productos || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setData((prevState) => ({ ...prevState, loading: false, error }));
      }
    };

    cargarDatos();
  }, []);

  if (data.loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (data.error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar datos. Por favor, inténtelo de nuevo más tarde.
      </div>
    );
  }

  return (
    <div
      className="bg-[url(https://res.cloudinary.com/dv84nv8y0/image/upload/v1738628244/Dise%C3%B1o_sin_t%C3%ADtulo_af8ore.png)] 
    bg-cover bg-center bg-no-repeat min-h-screen w-full flex items-center justify-center"
    >
      <main className="flex flex-col items-center justify-center w-full md:p-6 lg:p-8 text-center bg-gradient-to-r from-white">
        <img
          src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1739396784/Logo_2_dpgrjs.png"
          alt="Descripción"
          className="items-center justify-center"
        />
        <p className="text-4xl font-bold bg-clip-text text-lime-900 italic">
          Dotaciones Institucionales
        </p>
        <p className="text-3xl font-bold bg-clip-text text-lime-900 italic mb-2">
          Asesoría en Dotaciones Institucionales e Imagen Corporativa
        </p>
        <Login />
      </main>
    </div>
  );
};

export default Home;
