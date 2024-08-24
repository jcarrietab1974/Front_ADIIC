import React, { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const CrearCuenta = () => {
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
    //Los dos passwords deben ser iguales
    if (password !== confirmar) {
      console.log("Son diferentes los passwords");
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
      console.log(data);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    crearCuenta();
  };

  return (
    <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
      <div className="md:w-2/3 lg:w-2/5">
        <h1
          className=" colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
           bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          ADIIC Dotaciones Institucionales
        </h1>

        <h2
          className="colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
           bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
        >
          Iniciar sesion
        </h2>

        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={onSubmit}
        >
          <div className="my-5">
            <label className="uppercase text-gray-600 block text-lx font-bold">
              Nombre
            </label>
            <input
              type="nombre"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su Nombre"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={nombre}
              onChange={onChange}
            />

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

            <label className="uppercase text-gray-600 block text-lx font-bold">
              Confirme su Password
            </label>
            <input
              type="confirmar"
              id="confirmar"
              name="confirmar"
              placeholder="Confirmacion de de Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={confirmar}
              onChange={onChange}
            />
          </div>

          <input
            type="submit"
            value="Registrar Usuario"
            className="bg-violet-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
          />

          <Link className="block text-center my-5" to={"/"}>
            Regresar
          </Link>
        </form>
      </div>
    </main>
  );
};

export default CrearCuenta;
