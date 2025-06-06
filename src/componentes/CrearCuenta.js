import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import crud from "../conexiones/crud";
import Header from "./Header";
import Sidebar from "./Sidebar";

// ✅ Esquema de validación con Yup
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .email("Correo electrónico no válido")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co|es|info|biz)$/,
      "Dominio no permitido"
    )
    .required("El correo es obligatorio"),
  rol: yup
    .string()
    .oneOf(["admin", "regular"], "El rol debe ser 'admin' o 'regular'")
    .required("El rol es obligatorio"),
  password: yup
    .string()
    .min(5, "La contraseña debe tener al menos 5 caracteres")
    .required("La contraseña es obligatoria"),
  confirmar: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("La confirmación de la contraseña es obligatoria"),
});

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

  // ✅ useForm con validación de Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Función para crear cuenta
  const crearCuenta = async (data) => {
    const { nombre, email, rol, password } = data;

    const usuarioData = {
      nombre,
      email,
      rol,
      password,
    };

    const response = await crud.POST(`/api/usuarios`, usuarioData);
    const mensaje = response.msg;

    if (mensaje === "El usuario ya existe") {
      swal({
        title: "Error",
        text: "El usuario ya existe",
        icon: "error",
        button: {
          text: "OK",
          className: "btn btn-danger",
          closeModal: true,
        },
      });
    } else {
      swal({
        title: "Información",
        text: "El usuario fue creado correctamente",
        icon: "success",
        button: {
          text: "OK",
          className: "btn btn-primary",
          closeModal: true,
        },
      });

      // Reiniciar el formulario
      navigate("/admin");
    }
  };

  const onSubmit = (data) => {
    crearCuenta(data);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("nombre")}
                  placeholder="Ingrese su Nombre"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombre.message}
                  </p>
                )}

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email de registro"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Rol
                </label>
                <input
                  type="text"
                  {...register("rol")}
                  placeholder="Ingrese admin o regular"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                />
                {errors.rol && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.rol.message}
                  </p>
                )}

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password de registro"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Confirme su Password
                </label>
                <input
                  type="password"
                  {...register("confirmar")}
                  placeholder="Confirmación de Password"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                />
                {errors.confirmar && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmar.message}
                  </p>
                )}
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
