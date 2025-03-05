import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const ActualizarCategoria = () => {
  const navigate = useNavigate();

  const { idCategoria } = useParams();

  const [categoria, setCategoria] = useState({
    nombre: "",
    imagen: "",
  });

  const cargarCategoria = async () => {
    const response = await crud.GET(`/api/categorias/${idCategoria}`);
    console.log(response);
    setCategoria(response.categoria);
  };

  useEffect(() => {
    cargarCategoria();
  }, []);

  const { nombre, imagen } = categoria;

  const onChange = (e) => {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
  };

  const actualizarCategoria = async () => {
    const data = {
      nombre: categoria.nombre,
      imagen: categoria.imagen,
    };
    const response = await crud.PUT(`/api/categorias/${idCategoria}`, data);
    const mensaje = "La categoria se actualizo correctamente";
    swal({
      title: "Información",
      text: mensaje,
      icon: "success",
      button: {
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary ",
          closeModal: true,
        },
      },
    });
    navigate("/admin");
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
            Actualizar Categoria
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Nombre de la Categoria
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese la Categoria"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={nombre}
                  onChange={onChange}
                />
                <label className="uppercase text-gray-600 block text-sm font-bold">
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
                value="Actualizar Categoria"
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
