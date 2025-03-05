import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const ActualizarProductos = () => {
  const navigate = useNavigate();

  const { idCategoria, idProducto } = useParams(); // Asegúrarse de que idProducto esté en la URL

  console.log("idCategoria", idCategoria);
  console.log("idProducto", idProducto);

  const validarDatos = () => {
    if (!nombre || !descripcion || !precio || !stock) {
      swal("Error", "Todos los campos son obligatorios", "error");
      return false;
    }
    if (precio <= 0 || stock < 0) {
      swal("Error", "El precio y el stock deben ser mayores a cero", "error");
      return false;
    }
    return true;
  };

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

  //Cargar los datos del producto si idProducto está presente
  useEffect(() => {
    const cargarProducto = async () => {
      if (idProducto) {
        const response = await crud.GET(`/api/productos/${idProducto}`);
        console.log("response", response);
        const producto = response[0]; // Asegurarse de que la respuesta tenga la estructura correcta
        setCategoria({
          ...producto,
          //categoriaId: idCategoria, // Cambiado aquí
        });
      }
    };
    cargarProducto();
  }, [idProducto, idCategoria]);

  const ingresarCategoria = async () => {
    const data = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      stock: categoria.stock,
      precio: categoria.precio,
      imagen: categoria.imagen,
      categoriaId: idCategoria,
    };

    let response;
    if (idProducto) {
      // Si hay un idProducto, actualiza el producto
      response = await crud.PUT(`/api/productos/${idProducto}`, data);
    } else {
      // Si no hay idProducto, crea un nuevo producto
      response = await crud.POST("/api/productos", data);
    }

    //const mensaje = response.msg;
    const mensaje1 = idProducto
      ? "El producto se actualizó correctamente"
      : "El producto se creó correctamente";
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

    // Redireccionar nuevamente a la página de home-productos
    console.log("categoria", categoria);
    navigate(`/home-productos/${categoria.categoriaId}`);
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
            {idProducto ? "Actualizar Producto" : "Crear Productos"}
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="uppercase text-gray-600 block text-sm font-bold">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese el producto"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
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
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
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
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
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
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
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
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                  value={imagen}
                  onChange={onChange}
                />
              </div>
              <input
                type="submit"
                value="Actualizar Producto"
                className="bg-lime-500 hover:bg-lime-700 transition duration-300 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default ActualizarProductos;
