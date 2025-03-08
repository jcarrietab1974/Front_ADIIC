import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const ActualizarProductos = () => {
  const navigate = useNavigate();

  // Verificación del usuario ANTES del renderizado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const { idCategoria, idProducto } = useParams();

  const [categoria, setCategoria] = useState({
    nombre: "",
    descripcion: "",
    stock: 0,
    precio: 0,
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

  // Cargar datos del producto si existe un idProducto
  useEffect(() => {
    const cargarProducto = async () => {
      if (idProducto) {
        try {
          const response = await crud.GET(`/api/productos/${idProducto}`);
          if (response && response.length > 0) {
            setCategoria({
              ...response[0],
              categoriaId: idCategoria, // Asegurar que mantenga la relación con la categoría
            });
          }
        } catch (error) {
          console.error("Error al cargar el producto:", error);
          swal(
            "Error",
            "No se pudo cargar la información del producto",
            "error"
          );
        }
      }
    };
    cargarProducto();
  }, [idProducto, idCategoria]);

  const validarDatos = () => {
    if (!nombre || !descripcion || precio <= 0 || stock < 0) {
      swal(
        "Error",
        "Todos los campos son obligatorios y deben tener valores válidos",
        "error"
      );
      return false;
    }
    return true;
  };

  const ingresarCategoria = async () => {
    const data = {
      nombre,
      descripcion,
      stock,
      precio,
      imagen,
      categoriaId: idCategoria,
    };

    try {
      let response;
      if (idProducto) {
        response = await crud.PUT(`/api/productos/${idProducto}`, data);
      } else {
        response = await crud.POST("/api/productos", data);
      }

      const mensaje1 = idProducto
        ? "El producto se actualizó correctamente"
        : "El producto se creó correctamente";

      swal({
        title: "Información",
        text: mensaje1,
        icon: "success",
        button: "OK",
      });

      navigate(`/home-productos/${idCategoria}`);
    } catch (error) {
      console.error("Error al actualizar/crear el producto:", error);
      swal("Error", "No se pudo completar la operación", "error");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validarDatos()) return;
    ingresarCategoria();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center bg-lime-200 p-6">
          <p className="text-lime-900 font-bold text-3xl text-center mb-4 italic">
            {idProducto ? "Actualizar Producto" : "Crear Producto"}
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="uppercase text-gray-600 block text-sm font-bold">
                Nombre del producto
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingrese el producto"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={nombre}
                onChange={onChange}
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Descripción del producto
              </label>
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={descripcion}
                onChange={onChange}
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Stock del producto
              </label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={stock}
                onChange={onChange}
                min="0"
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Precio del producto
              </label>
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={precio}
                onChange={onChange}
                min="0"
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Imagen del producto
              </label>
              <input
                type="text"
                name="imagen"
                placeholder="URL de la imagen"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={imagen}
                onChange={onChange}
              />

              <input
                type="submit"
                value={idProducto ? "Actualizar Producto" : "Crear Producto"}
                className="bg-lime-500 hover:bg-lime-700 transition duration-300 w-full py-3 text-white uppercase font-bold rounded cursor-pointer"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default ActualizarProductos;
