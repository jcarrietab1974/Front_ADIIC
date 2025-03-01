import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import crud from "../conexiones/crud";
import swal from "sweetalert";

const Admin = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
    };
    autenticarUsuario();
  }, [navigate]);

  const cargarCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await crud.GET(`/api/categorias`);
      if (response && response.categoria) {
        setCategorias(response.categoria);
      } else {
        console.error("Respuesta de la API inválida:", response);
        swal(
          "Error",
          "No se pudieron cargar las categorías. Contacte al administrador.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
      swal(
        "Error",
        "Ocurrió un error al cargar las categorías. Inténtelo nuevamente más tarde.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const borrarCategoria = async (e, idCategoria) => {
    swal({
      title: "¿Estás seguro de eliminar esta categoría?",
      text: "¡Una vez borrada, no podrás recuperar esta categoría!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        e.preventDefault();
        try {
          const response = await crud.DELETE(`/api/categorias/${idCategoria}`);
          if (response) {
            swal("¡Poof! ¡Su categoría ha sido borrada correctamente!", {
              icon: "success",
            });
            cargarCategorias();
          }
        } catch (error) {
          console.error("Error al borrar la categoría:", error);
          swal("Error", "Ocurrió un error al borrar la categoría.", "error");
        }
      } else {
        swal("¡Tu categoría está a salvo!");
      }
    });
  };

  const actualizarCategoria = (idCategoria) => {
    navigate(`/actualizar-categoria/${idCategoria}`);
  };

  const crearProductos = (idCategoria) => {
    navigate(`/home-productos/${idCategoria}`);
  };

  if (isLoading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <div className="w-full md:w-auto">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">
          <h1 className="text-lime-900 font-bold text-4xl tracking-tight text-center mb-6 italic">
            Lista de categorías
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-4">
            {categorias.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md flex flex-col"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-full object-contain object-center"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 text-center">
                    {item.nombre}
                  </h2>
                  <p className="text-gray-600 text-center mb-4">{item._id}</p>
                  <div className="flex flex-col space-y-2 justify-end">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                      onClick={(e) => borrarCategoria(e, item._id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                      onClick={() => actualizarCategoria(item._id)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                      onClick={() => crearProductos(item._id)}
                    >
                      Productos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
