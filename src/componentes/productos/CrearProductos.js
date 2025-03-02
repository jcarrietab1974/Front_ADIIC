import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const CrearProductos = () => {
  const navigate = useNavigate();
  const { idCategoria } = useParams();
  const [categoria, setCategoria] = useState({
    nombre: "",
    descripcion: "",
    stock: "",
    precio: "",
    imagen: "",
    categoriaId: "",
  });

  const { nombre, descripcion, stock, precio, imagen } = categoria;

  const onChange = (e) => {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
  };

  const ingresarCategoria = async () => {
    const data = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      stock: categoria.stock,
      precio: categoria.precio,
      imagen: categoria.imagen,
      categoriaId: idCategoria,
    };
    //console.log(data);
    const response = await crud.POST("/api/productos", data);
    const mensaje = response.msg;
    const mensaje1 = "El producto se creo correctamente";
    swal({
      title: "Información",
      text: mensaje1,
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

    //Redireccionar nuevamente a la pagina de home-productos
    navigate(`/home-productos/${idCategoria}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ingresarCategoria();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-lime-200">
          <div className="flex justify-center">
          <h1 className="text-lime-900 font-bold text-3xl tracking-tight text-center italic">
            Crear Productos
          </h1>
          </div>
          <div className="flex justify-center">
            <form
              onSubmit={onSubmit}
              className="bg-lime-300 shadow rounded-lg p-8 my-3"
            >
              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Nombre del producto
                </label>
                <input
                  type="nombre"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese el producto"
                  className="w-full my-1 p-3 border rounded-xl bg-gray-50"
                  value={nombre}
                  onChange={onChange}
                />

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Descripcion del producto
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  placeholder="descripcion"
                  className="w-full my-1 p-3 border rounded-xl bg-gray-50"
                  value={descripcion}
                  onChange={onChange}
                />

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Stock del producto
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="stock"
                  className="w-full my-1 p-3 border rounded-xl bg-gray-50"
                  value={stock}
                  onChange={onChange}
                />

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Precio del producto
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  placeholder="precio"
                  className="w-full my-1 p-3 border rounded-xl bg-gray-50"
                  value={precio}
                  onChange={onChange}
                />

                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Imagen del producto
                </label>
                <input
                  type="text"
                  id="imagen"
                  name="imagen"
                  placeholder="Imagen del producto"
                  className="w-full my-1 p-3 border rounded-xl bg-gray-50"
                  value={imagen}
                  onChange={onChange}
                />
              </div>
              <input
                type="submit"
                value="Crear Productos"
                className="bg-lime-500 w-full my-2 py-2 text-white uppercase font-bold rounded hover:cursor-pointer"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};
export default CrearProductos;
