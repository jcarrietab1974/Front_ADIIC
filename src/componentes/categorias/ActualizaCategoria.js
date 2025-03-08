import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const ActualizarCategoria = () => {
  const navigate = useNavigate();
  const { idCategoria } = useParams();
  const [categoria, setCategoria] = useState({ nombre: "", imagen: "" });

  useEffect(() => {
    const autenticarUsuario = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirigir si no hay token
      }
    };
    autenticarUsuario();
  }, [navigate]);

  useEffect(() => {
    const cargarCategoria = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await crud.GET(`/api/categorias/${idCategoria}`);
        setCategoria(response.categoria);
      } catch (error) {
        console.error("Error al cargar la categoría:", error);
        swal("Error", "No se pudo cargar la categoría", "error");
      }
    };

    cargarCategoria();
  }, [idCategoria]);

  const onChange = (e) => {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
  };

  const actualizarCategoria = async () => {
    try {
      const data = { nombre: categoria.nombre, imagen: categoria.imagen };
      await crud.PUT(`/api/categorias/${idCategoria}`, data);
      swal("Información", "La categoría se actualizó correctamente", "success");
      navigate("/admin");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      swal("Error", "No se pudo actualizar la categoría", "error");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    actualizarCategoria();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center bg-lime-200 p-6">
          <p className="text-lime-900 font-bold text-3xl text-center mb-4 italic">
            Actualizar Categoría
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese la Categoría"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={categoria.nombre}
                  onChange={onChange}
                />
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Imagen de la Categoría
                </label>
                <input
                  type="text"
                  id="imagen"
                  name="imagen"
                  placeholder="Imagen"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  value={categoria.imagen}
                  onChange={onChange}
                />
              </div>
              <input
                type="submit"
                value="Actualizar Categoría"
                className="bg-lime-500 hover:bg-lime-700 transition duration-300 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default ActualizarCategoria;
