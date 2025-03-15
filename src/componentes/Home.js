import React from "react";
import Login from "./Login";

const Home = () => {
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
