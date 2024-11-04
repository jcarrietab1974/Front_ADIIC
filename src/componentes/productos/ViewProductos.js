import React, { useEffect, useState } from "react";
import crud from "../../conexiones/crud";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import ActualizarProductos from "./ActualizarProductos";

export const ViewProductos = ({ producto }) => {
  const navigate = useNavigate();
  const { nombre, descripcion, stock, precio, imagen } = producto;

  const { idCategoria } = useParams();

  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    const response = await crud.GET(`/api/productos/${idCategoria}`);
    setProductos(response);
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
    <div className="border-b p-5 flex justify-between items-center w-2/3">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl text-gray-50">nombre:{nombre}</p>
        <p className="mb-1 text-sm text-gray-50 uppercase">
          descripcion:{descripcion}
        </p>
        <p className="mb-1  text-gray-50">stock:{stock}</p>
        <p className="mb-1  text-gray-50">precio:{precio}</p>
        <img src={imagen} width="150" height="150" alt="imagen-producto"></img>
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        onClick={(e) => actualizarProducto(e, producto._id)}
        >
          Editar
        </button>

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => borrarProducto(e, producto._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
export default ViewProductos;
