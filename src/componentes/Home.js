import React from "react";
import { Link} from "react-router-dom";

const Home = () => {
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
          Home de clientes
        </h2>
        <Link className="block text-center my-5 text-gray-100 text-xl" to={"/login"}>
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
};
export default Home;
