import React from "react";

const Admin = () => {
  return (
    <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
      <div className="md:w-2/3 lg:w-3/5">
        <h1
          className=" colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
         bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          "ADIIC Dotaciones Institucionales"
        </h1>

        <h2 className="colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200 bg-clip-text font-display text-4xl tracking-tight text-transparent text-center">
          Panel de Administrador
        </h2>
      </div>
    </main>
  );
};

export default Admin;
