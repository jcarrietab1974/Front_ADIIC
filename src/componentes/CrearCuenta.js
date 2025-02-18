import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import crud from "../conexiones/crud";

const CrearCuenta = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
  });

  const { nombre, email, password, confirmar } = usuario;

  const onChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const crearCuenta = async () => {
    if (password !== confirmar) {
      const mensaje = "Las contraaseñas son diferentes.";
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
    } else {
      const data = {
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password,
      };
      const response = await crud.POST(`/api/usuarios`, data);
      const mensaje = response.msg;
      if (mensaje === "El usuario ya existe") {
        swal({
          title: "Error",
          text: "El usuario ya existe",
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
        swal({
          title: "Información",
          text: "El usuario fue creado correctamente",
          icon: "success",
          button: {
            confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "btn btn-primary",
              closeModal: true,
            },
          },
        });
        setUsuario({
          nombre: "",
          email: "",
          password: "",
          confirmar: "",
        });
        navigate("/login");
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    crearCuenta();
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-lime-100">
      <div className="w-full max-w-xs p-5 bg-white shadow-lg rounded-lg">
        <img
          src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1732987889/logo-dotac-1-337x133_zp5dzx.png"
          alt="Descripción"
          className="w-4/5 mx-auto mb-4"
        />

        <form onSubmit={onSubmit}>
          <div>
            <label className="uppercase text-gray-600 block text-xs font-bold">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su Nombre"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={nombre}
              onChange={onChange}
            />

            <label className="uppercase text-gray-600 block text-xs font-bold">
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

            <label className="uppercase text-gray-600 block text-xs font-bold">
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

            <label className="uppercase text-gray-600 block text-xs font-bold">
              Confirme su Password
            </label>
            <input
              type="password"
              id="confirmar"
              name="confirmar"
              placeholder="Confirmación de Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={confirmar}
              onChange={onChange}
            />
          </div>

          <input
            type="submit"
            value="Registrar Usuario"
            className="bg-lime-500 mb-5 w-full my-2 py-3 text-white uppercase font-bold rounded hover:cursor-pointer text-xs"
          />

          <Link className="block text-center font-bold" to={"/admin"}>
            Regresar
          </Link>
        </form>
      </div>
    </main>
  );
};

export default CrearCuenta;