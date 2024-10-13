import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import crud from "../conexiones/crud";
import swal from "sweetalert";

const Login = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const { email, password } = usuario;

  const onChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const ingresarCuenta = async () => {
    // Verificar si los campos están vacíos
    if (email.trim() === "" || password.trim() === "") {
      swal({
        title: "Error",
        text: "Por favor, ingrese el correo electrónico y la contraseña.",
        icon: "warning",
        button: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
        },
      });
      return; // Detener la ejecución si los campos están vacíos
    }

    // Los dos password deben ser iguales
    const data = {
      email: usuario.email,
      password: usuario.password,
    };
    //console.log(data);
    const response = await crud.POST(`/api/auth`, data);
    const mensaje = response.msg;
    // console.log(mensaje);
    if (mensaje === "El usuario no existe") {
      const mensaje = "El usuario no existe";
      swal({
        title: "Error",
        text: mensaje,
        icon: "error",
        button: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
        },
      });
    } else if (mensaje === "Password incorrecto") {
      const mensaje = "Password incorrecto";
      swal({
        title: "Error",
        text: mensaje,
        icon: "error",
        button: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
        },
      });

      //Datos vacios
      //} else if (mensaje === "Ingrese sus credenciales") {
      //const mensaje = "Ingrese sus credenciales";
      //swal({
      //title: "Error",
      //text: mensaje,
      //icon: "error",
      //: {
      //confirm: {
      //text: "OK",
      //value: true,
      //visible: true,
      //className: "btn btn-danger",
      //closeModal: true,
      //},
      //},
      //});
    } else {
      const jwt = response.token;

      //Guardar la informacion en el localStorage
      localStorage.setItem("token", jwt);

      //Redireccionar nuevamente a la pagina de Admin.js
      navigate("/admin");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ingresarCuenta();
  };

  return (
    <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
      <div className="md:w-2/3 lg:w-2/4">
        <h1
          className=" colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
         bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          "ADIIC Dotaciones Institucionales"
        </h1>

        <h2
          className="colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
         bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          Iniciar sesion
        </h2>

        <form
          onSubmit={onSubmit}
          className="my-10 bg-white shadow rounded-lg p-10"
        >
          <div className="my-5">
            <label className="uppercase text-gray-600 block text-lx font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email de registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={email}
              onChange={onChange}
            />
            <br></br>
            <label className="uppercase text-gray-600 block text-lx font-bold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password de registro"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={onChange}
            />
          </div>

          <input
            type="submit"
            value="Iniciar Sesión"
            className="bg-violet-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
          />

          <Link className="block text-center my-5" to={"/crear-cuenta"}>
            Crear Cuenta
          </Link>
        </form>
      </div>
    </main>
  );
};

export default Login;
