import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import crud from "../conexiones/crud";
import swal from "sweetalert";

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
    const data = {
      nombre: categoria.nombre,
      imagen: categoria.imagen,
    };
    await crud.POST("/api/categorias", data);
    swal({
      title: "Información",
      text: "La categoria se creó correctamente",
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
      <div className="flex items-center justify-center min-h-screen bg-lime-100">
        <main className="flex flex-col items-center justify-center w-full max-w-xs p-10 bg-white shadow rounded-lg">
          <img
            src="https://res.cloudinary.com/dv84nv8y0/image/upload/v1732987889/logo-dotac-1-337x133_zp5dzx.png"
            alt="Descripción"
            className="w-3xs mx-auto"
          />
          <form onSubmit={onSubmit} className="w-full">
            <div className="my-5">
              <label className="uppercase text-gray-600 block text-xs font-bold">
                Nombre de la Categoria
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingrese la Categoria"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={nombre}
                onChange={onChange}
              />

              <label className="uppercase text-gray-600 block text-xs font-bold mt-4">
                Imagen de la Categoria
              </label>
              <input
                type="text"
                id="imagen"
                name="imagen"
                placeholder="Imagen"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={imagen}
                onChange={onChange}
              />
            </div>

            <input
              type="submit"
              value="Crear Categoria"
              className="bg-lime-500 mb-5 w-full py-3 text-black uppercase font-bold rounded hover:cursor-pointer"
            />
            <Link className="block text-center font-bold" to={"/admin"}>
              Regresar
            </Link>
          </form>
        </main>
      </div>
    </>
  );
};

export default CrearCategoria;