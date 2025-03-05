import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import crud from "../conexiones/crud";
import swal from "sweetalert";
import Header from "./Header";
import Sidebar from "./Sidebar";

const CrearCategoria = () => {
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState({
    nombre: "",
    imagen: "",
  });

  const { nombre, imagen } = categoria;

  const onChange = (e) => {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
  };

  const ingresarCategoria = async () => {
    const data = { nombre, imagen };
    await crud.POST("/api/categorias", data);
    swal({
      title: "Información",
      text: "La categoría se creó correctamente",
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

    navigate("/admin");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ingresarCategoria();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center bg-lime-200 p-6">
          <p className="text-lime-900 font-bold text-3xl text-center mb-4 italic">
            Crear Categoría
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
                  value={nombre}
                  onChange={onChange}
                />
              </div>

              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Imagen de la Categoría
                </label>
                <input
                  type="text"
                  id="imagen"
                  name="imagen"
                  placeholder="URL de la Imagen"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={imagen}
                  onChange={onChange}
                />
              </div>

              <input
                type="submit"
                value="Crear Categoría"
                className="bg-lime-500 w-full py-3 text-black uppercase font-bold rounded hover:bg-lime-600 transition-colors text-sm"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default CrearCategoria;
