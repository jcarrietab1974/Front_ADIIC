import React, { useEffect, useState } from "react";
import crud from "../../conexiones/crud";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";

export const ViewProductos = ({ producto }) => {
  const navigate = useNavigate();

  const { nombre, descripcion, stock, precio, imagen } = producto;

  const { idCategoria } = useParams();

  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    const response = await crud.GET(`/api/productos/${idCategoria}`);
    setProductos(response.productos);
  };

  console.log(productos);

  useEffect(() => {
    cargarProductos();
  }, []); //Para que solo se ejecute una vez

  const borrarProducto = async (e, idProducto) => {
    swal({
      title: "¿Estás seguro de eliminar este producto?",
      text: "¡Una vez borrado, no podrás recuperar este producto!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        e.preventDefault();
        const response = await crud.DELETE(`/api/productos/${idProducto}`);
        if (response) {
          swal("¡Poof! ¡Tu producto ha sido borrado correctamente!", {
            icon: "success",
          }).then(() => {
            // Recargar el navegador para reflejar los cambios
            window.location.reload();
          });
        }
      } else {
        swal("¡Tu producto está a salvo!");
      }
    });
  };

  const actualizarProducto = async (e, idProducto) => {
    navigate(`/actualizar-producto/${idProducto}`);
  };

  return (
    <div className="border-b p-5 w-full md:w-2/3 lg:w-3/4 mx-auto flex flex-col lg:flex-row items-center gap-4">
      <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
        <img
          src={imagen}
          alt="imagen-producto"
          className="max-w-full h-auto rounded-lg"
        />
      </div>

      <div className="flex flex-col flex-grow lg:flex-grow-0 items-start w-full lg:w-2/3">
        <p className="mb-1 text-lg text-gray-50 break-words">
          Nombre: {nombre}
        </p>
        <p className="mb-1 text-lg text-gray-50 break-words">
          Descripción: {descripcion}
        </p>
        <p className="mb-1 text-lg text-gray-50">Stock: {stock}</p>
        <p className="mb-1 text-lg text-gray-50">Precio: ${precio}</p>
        <div className="flex flex-row flex-wrap mt-4 gap-2 w-full justify-center lg:justify-start">
          <button
            className="bg-lime-300 hover:bg-lime-900 text-black font-bold py-2 px-4 rounded w-auto"
            onClick={(e) => actualizarProducto(e, producto._id)}
          >
            Editar
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto"
            onClick={(e) => borrarProducto(e, producto._id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
export default ViewProductos;
