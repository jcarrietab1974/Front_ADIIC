import React from "react";
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
