import React from "react";
import { Link } from "react-router-dom";    

const Login = () => {
  return (
    <div>
      <h1>Almacenes "ADIIC Dotaciones Institucionales"</h1>
      <h1>Iniciar sesión</h1>
      <h2>Bienvenido, ingrese sus credenciales</h2>
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Ingresar</button>
      <Link to={"/crear-cuenta"}>Crear cuenta</Link>
    </div>
  );
};

export default Login;
