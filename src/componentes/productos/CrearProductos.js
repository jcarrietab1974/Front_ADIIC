import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import crud from "../../conexiones/crud";
import swal from "sweetalert";

const CrearProductos = () => {
  const navigate = useNavigate();
  const { idCategoria } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [categoria, setCategoria] = useState({
    referencia: "",
    nombre: "",
    descripcion: "",
    talla: "",
    color: "",
    stock: "",
    precio: "",
    imagen: "",
    categoriaId: "",
  });

  const [camposVacios, setCamposVacios] = useState([]);

  const {
    referencia,
    nombre,
    descripcion,
    talla,
    color,
    stock,
    precio,
    imagen,
  } = categoria;

  const onChange = (e) => {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
    // Limpia el campo de la lista de campos vacíos si el usuario lo diligencia
    if (camposVacios.includes(e.target.name)) {
      setCamposVacios(camposVacios.filter((campo) => campo !== e.target.name));
    }
  };

  const ingresarCategoria = async () => {
    try {
      const data = {
        referencia,
        nombre,
        descripcion,
        talla,
        color,
        stock,
        precio,
        imagen,
        categoriaId: idCategoria,
      };

      const response = await crud.POST("/api/productos", data);

      if (response.error) {
        swal({
          title: "Error",
          text: response.msg || "No se pudo crear el producto",
          icon: "error",
          button: "OK",
        });
        return;
      }

      swal({
        title: "Información",
        text: "El producto se creó correctamente",
        icon: "success",
        button: "OK",
      });

      navigate(`/home-productos/${idCategoria}`);
    } catch (error) {
      swal({
        title: "Error",
        text: "Ocurrió un error al crear el producto",
        icon: "error",
        button: "OK",
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validar campos vacíos
    const camposObligatorios = [
      "referencia",
      "nombre",
      "descripcion",
      "talla",
      "color",
      "stock",
      "precio",
      "imagen",
    ];

    let vacios = camposObligatorios.filter(
      (campo) => !categoria[campo] || categoria[campo].toString().trim() === ""
    );

    // Validar stock y precio como números positivos
    if (
      categoria.stock === "" ||
      isNaN(Number(categoria.stock)) ||
      Number(categoria.stock) <= 0
    ) {
      if (!vacios.includes("stock")) vacios.push("stock");
    }
    if (
      categoria.precio === "" ||
      isNaN(Number(categoria.precio)) ||
      Number(categoria.precio) <= 0
    ) {
      if (!vacios.includes("precio")) vacios.push("precio");
    }

    setCamposVacios(vacios);

    if (vacios.length > 0) {
      swal({
        title: "Campos obligatorios",
        text: "Debes completar todos los campos correctamente.\nAsegúrate que stock y precio sean números mayores a 0.",
        icon: "warning",
        button: "OK",
      });
      return;
    }

    ingresarCategoria();
  };

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center bg-lime-200 p-6">
          <p className="text-lime-900 font-bold text-3xl text-center mb-4 italic">
            Crear Producto
          </p>
          <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={onSubmit} className="space-y-4">
              {[
                "referencia",
                "nombre",
                "descripcion",
                "talla",
                "color",
                "stock",
                "precio",
                "imagen",
              ].map((campo) => (
                <div key={campo}>
                  <label className="uppercase text-gray-600 block text-sm font-bold">
                    {campo.charAt(0).toUpperCase() + campo.slice(1)} del
                    producto
                  </label>
                  <input
                    type={
                      campo === "stock" || campo === "precio"
                        ? "number"
                        : "text"
                    }
                    id={campo}
                    name={campo}
                    placeholder={`Ingrese ${campo}`}
                    className={`w-full mt-2 p-3 border rounded-xl bg-gray-50 ${
                      camposVacios.includes(campo) ? "border-red-500" : ""
                    }`}
                    value={categoria[campo]}
                    onChange={onChange}
                    min={
                      campo === "stock" || campo === "precio" ? 1 : undefined
                    }
                  />
                </div>
              ))}
              <input
                type="submit"
                value="Crear Productos"
                className="bg-lime-500 w-full py-3 text-black uppercase font-bold rounded hover:bg-lime-600 transition-colors text-sm"
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default CrearProductos;
