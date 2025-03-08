import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import crud from "../conexiones/crud";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";

// ✅ Esquema de validación con Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Correo electrónico no válido")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co|es|info|biz)$/,
      "Dominio no permitido"
    )
    .required("El correo es obligatorio"),
  password: yup
    .string()
    .min(5, "La contraseña debe tener al menos 5 caracteres")
    .required("La contraseña es obligatoria"),
});

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // ✅ useForm con validación de Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Función para manejar el login
  const ingresarCuenta = async (data) => {
    try {
      const response = await crud.POST(`/api/auth`, data);
      const mensaje = response.msg;

      if (mensaje === "El usuario no existe") {
        swal({
          title: "Error",
          text: "El usuario no está registrado.",
          icon: "error",
          button: "OK",
        });
        return;
      }

      if (mensaje === "Password incorrecto") {
        swal({
          title: "Error",
          text: "La contraseña ingresada es incorrecta.",
          icon: "error",
          button: "OK",
        });
        return;
      }

      // ✅ Guardar el token y redirigir
      const jwt = response.token;
      localStorage.setItem("token", jwt);

      // ✅ Decodificar token para obtener el rol del usuario
      const decoded = jwtDecode(jwt);
      const rol = decoded.usuario.rol.toLowerCase();

      // ✅ Redirigir según el rol
      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "regular") {
        navigate("/regular");
      } else {
        swal({
          title: "Error",
          text: "Rol de usuario no reconocido.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      swal({
        title: "Error",
        text: "Hubo un problema en la autenticación.",
        icon: "error",
        button: "OK",
      });
      console.error("Error en login:", error);
    }
  };

  return (
    <section className="flex-1 flex flex-col items-center bg-lime-200 p-6 rounded-xl my-2">
      <form
        onSubmit={handleSubmit(ingresarCuenta)}
        className="space-y-4 w-full max-w-sm"
      >
        {/* Email */}
        <label className="block text-gray-600 text-lg font-bold">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="ejemplo@correo.com"
          className="w-full p-3 border rounded-xl bg-gray-50 text-sm"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}

        {/* Password */}
        <label className="block text-gray-600 text-lg font-bold mt-3">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="Mínimo 5 caracteres"
          className="w-full p-3 border rounded-xl bg-gray-50 text-sm"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}

        {/* Botón de enviar */}
        <button
          type="submit"
          className="bg-lime-500 my-1 w-full py-3 text-white uppercase font-bold rounded hover:bg-lime-600"
        >
          Iniciar Sesión
        </button>
      </form>
    </section>
  );
};

export default Login;
