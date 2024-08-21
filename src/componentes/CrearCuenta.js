import React from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";

const CrearCuenta = () => {

    return (
        <main className='container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center'>
        <div className='md:w-2/3 lg:w-2/5'>
           <h1 className=' colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
           bg-clip-text font-display text-4xl tracking-tight text-transparent '>
             ADIIC Dotaciones Institucionales
           </h1>
  
           <h2 className='colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
           bg-clip-text font-display text-4xl tracking-tight text-transparent text-center'>Iniciar sesion</h2>
      
           
           <form className="my-10 bg-white shadow rounded-lg p-10">
             <div className="my-5">

             <label className="uppercase text-gray-600 block text-lx font-bold">Nombre</label>
               <input
                 type="nombre"
                 placeholder="Ingrese su Nombre"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
               />

               <label className="uppercase text-gray-600 block text-lx font-bold">Email</label>
               <input
                 type="email"
                 placeholder="Email de registro"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
               />
                       
               
               
              
              <label className="uppercase text-gray-600 block text-lx font-bold">Password</label>
               <input
                 type="password"
                 placeholder="Password de registro"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
               />
              
               <label className="uppercase text-gray-600 block text-lx font-bold">Confirme su Password</label>
               <input
                 type="password"
                 placeholder="Confirmacion de de Password"
                 className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
               />
          
             </div>
  
             <input
                    type="submit"
                    value="Registrar Usuario"
                    className="bg-violet-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
               />
             
  
                <Link
                  className="block text-center my-5"
                  to={"/"}
                >           
                  Regresar
               </Link>
           </form>
  
        </div>
  
     </main>
    );

}

export default CrearCuenta;
=======
import { Link } from "react-router-dom";  

const CrearCuenta = () => {
  return (
    <div>
      <h1>Crear cuenta</h1>
      <h2>Ingrese los datos del usuario</h2>
      <input type="text" name="" placeholder="Nombre" />
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirmar Password" />
      <button>Crear cuanta</button>
      <Link to={"/"}>Regresar</Link>
    </div>
  );
};

export default CrearCuenta;
>>>>>>> 63147b37533bdd16aa1e591ed6fe4ebf80d87542
