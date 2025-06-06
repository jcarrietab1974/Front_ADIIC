import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import crud from "../../conexiones/crud";

const ClienteModal = ({
  clienteState,
  changeModalCliente,
  actualizarClientes,
}) => {
  const [cliente, setCliente] = useState(clienteState);

  useEffect(() => {
    setCliente(clienteState);
  }, [clienteState]);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await crud.PUT(`/api/clientes/${cliente._id}`, cliente);
      if (response) {
        swal("Éxito", "Cliente actualizado correctamente.", "success");
        actualizarClientes();
        changeModalCliente();
      }
    } catch (error) {
      swal("Error", "No se pudo actualizar el cliente.", "error");
    }
  };

  const handleDelete = async () => {
    swal({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm) {
        try {
          await crud.DELETE(`/api/clientes/${cliente._id}`);
          swal("Éxito", "Cliente eliminado correctamente.", "success");
          actualizarClientes();
          changeModalCliente();
        } catch (error) {
          swal("Error", "No se pudo eliminar el cliente.", "error");
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-lime-200 rounded-lg shadow-lg p-6 max-w-md w-full">
        <p className="text-xl font-bold text-gray-700 mb-4 text-center">
          Cliente
        </p>

        <div className="space-y-4">
          {["nombre", "nit", "direccion", "ciudad", "telefono"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium capitalize">
                {field}:
              </label>
              <input
                type="text"
                name={field}
                value={cliente[field] || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full sm:w-auto"
            onClick={handleDelete}
          >
            Eliminar
          </button>

          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
            onClick={changeModalCliente}
          >
            Cerrar
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
            onClick={handleUpdate}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteModal;
