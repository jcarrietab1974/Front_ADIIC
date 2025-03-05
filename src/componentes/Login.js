import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import crud from "../conexiones/crud";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";

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
      return;
    }

    const data = { email, password };
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

      // Decodificar el token
      const decoded = jwtDecode(jwt);
      const rol = decoded.usuario.rol.toLowerCase(); // Asegurar que el rol esté correctamente en el token

      // Redirigir según el rol
      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "regular") {
        navigate("/regular");
      } else {
        swal({
          title: "Error",
          text: "Rol de usuario no reconocido.",
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
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ingresarCuenta();
  };

  return (
    <section className="flex-1 flex flex-col items-center bg-lime-200 p-6 rounded-xl my-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-sm font-bold text-left mt-3"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 text-sm"
            value={usuario.email}
            onChange={onChange}
          />

          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-sm font-bold text-left mt-3"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 text-sm"
            value={usuario.password}
            onChange={onChange}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-lime-500 my-1 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer text-sm"
        />
      </form>
    </section>
  );
};

export default Login;
