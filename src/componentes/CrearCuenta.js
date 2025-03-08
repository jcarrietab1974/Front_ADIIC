import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import crud from "../conexiones/crud";
import Header from "./Header";
import Sidebar from "./Sidebar";

const CrearCuenta = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
    };
    autenticarUsuario();
  }, [navigate]);

  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    rol: "",
    password: "",
    confirmar: "",
  });

  const { nombre, email, rol, password, confirmar } = usuario;

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
        rol: usuario.rol,
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
          rol: "",
          password: "",
          confirmar: "",
        });
        navigate("/");
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    crearCuenta();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center bg-lime-200 p-6">
          <p className="text-lime-900 font-bold text-3xl text-center mb-4 italic">
            Registrar Usuario
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese su Nombre"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={nombre}
                  onChange={onChange}
                />
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email de registro"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={email}
                  onChange={onChange}
                />
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Rol
                </label>
                <input
                  type="text"
                  id="rol"
                  name="rol"
                  placeholder="Ingrese admin o regular"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={rol}
                  onChange={onChange}
                />
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password de registro"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={password}
                  onChange={onChange}
                />
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Confirme su Password
                </label>
                <input
                  type="password"
                  id="confirmar"
                  name="confirmar"
                  placeholder="Confirmación de Password"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={confirmar}
                  onChange={onChange}
                />
              </div>
              <input
                type="submit"
                value="Registrar Usuario"
                className="bg-lime-500 w-full py-3 text-black uppercase font-bold rounded hover:bg-lime-600 transition-colors text-sm"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default CrearCuenta;
