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

    const data = {
      email: usuario.email,
      password: usuario.password,
    };
    const response = await crud.POST(`/api/auth`, data);
    const mensaje = response.msg;

    if (mensaje === "El usuario no existe") {
      swal({
        title: "Error",
        text: "El usuario no existe",
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
      swal({
        title: "Error",
        text: "Password incorrecto",
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
    } else {
      const jwt = response.token;
      localStorage.setItem("token", jwt);
      navigate("/admin");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ingresarCuenta();
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-lime-100">
      <div className="w-full max-w-md p-5">
        <img
          src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1732987889/logo-dotac-1-337x133_zp5dzx.png"
          alt="Descripción"
          className="w-3xs mx-auto"
        />

        <form
          onSubmit={onSubmit}
          className="my-3 bg-white shadow rounded-lg p-10"
        >
          <div className="my-4">
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
            <br />
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
            className="bg-lime-500 my-1 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
          />
          <Link className="block text-center my-1 font-bold" to={"/"}>
            Regresar
          </Link>
        </form>
      </div>
    </main>
  );
};

export default Login;

/* <h2 className="bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200 bg-clip-text font-display text-4xl tracking-tight text-transparent text-center">
          Iniciar sesión
        </h2>*/
