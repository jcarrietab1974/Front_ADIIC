import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const ActualizarProductos = () => {
  const navigate = useNavigate();
  const { idProducto } = useParams(); // Eliminamos idCategoria ya que no está en la ruta

  const [producto, setProducto] = useState({
    referencia: "",
    nombre: "",
    descripcion: "",
    talla: "",
    color: "",
    stock: 0,
    precio: 0,
    imagen: "",
    categoriaId: "", // Inicializamos la categoría correctamente
  });

  // Verificación del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Cargar datos del producto
  useEffect(() => {
    const cargarProducto = async () => {
      if (idProducto) {
        try {
          const response = await crud.GET(`/api/productos/${idProducto}`);
          if (response && response.length > 0) {
            setProducto(response[0]); // Asignamos la categoría real del producto
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
  }, [idProducto]);

  const onChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const validarDatos = () => {
    if (
      !producto.referencia ||
      !producto.nombre ||
      !producto.descripcion ||
      !producto.talla ||
      !producto.color ||
      producto.precio <= 0 ||
      producto.stock < 0
    ) {
      swal(
        "Error",
        "Todos los campos son obligatorios y deben tener valores válidos",
        "error"
      );
      return false;
    }
    return true;
  };

  const actualizarProducto = async () => {
    try {
      await crud.PUT(`/api/productos/${idProducto}`, producto);

      swal({
        title: "Información",
        text: "El producto se actualizó correctamente",
        icon: "success",
        button: "OK",
      });

      navigate(`/home-productos/${producto.categoriaId}?updated=true`);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      swal("Error", "No se pudo completar la operación", "error");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validarDatos()) return;
    actualizarProducto();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center bg-lime-200 p-6">
          <p className="text-lime-900 font-bold text-3xl text-center mb-4 italic">
            Actualizar Producto
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="uppercase text-gray-600 block text-sm font-bold">
                Referencia del producto
              </label>
              <input
                type="text"
                name="referencia"
                placeholder="Ingrese el producto"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={producto.referencia}
                onChange={onChange}
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Nombre del producto
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingrese el producto"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={producto.nombre}
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
                value={producto.descripcion}
                onChange={onChange}
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Talla del producto
              </label>
              <input
                type="text"
                name="talla"
                placeholder="Ingrese el producto"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={producto.talla}
                onChange={onChange}
              />

              <label className="uppercase text-gray-600 block text-sm font-bold">
                Color del producto
              </label>
              <input
                type="text"
                name="color"
                placeholder="Ingrese el producto"
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                value={producto.color}
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
                value={producto.stock}
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
                value={producto.precio}
                onChange={onChange}
                min="0"
              />

              <input
                type="submit"
                value="Actualizar Producto"
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
