import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import crud from "../../conexiones/crud";

const CabeceraModal = ({
  cabeceraState,
  changeModalCabecera,
  actualizarCabeceras,
}) => {
  const [cabecera, setCabecera] = useState(cabeceraState);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCabecera(cabeceraState);
  }, [cabeceraState]);

  const handleChange = (e) => {
    setCabecera({
      ...cabecera,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const { local, nit, direccion, telefono, email } = cabecera;

    // Validar campos vacíos
    if (!local || !nit || !direccion || !telefono || !email) {
      swal("Advertencia", "Todos los campos son obligatorios.", "warning");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await crud.PUT(
        `/api/cabecera/${cabecera._id}`,
        cabecera
      );

      swal(
        "Éxito",
        response.msg || "Cabecera actualizada correctamente.",
        "success"
      );
      actualizarCabeceras();
      changeModalCabecera();
    } catch (error) {
      const msg =
        error.response?.data?.msg || "No se pudo actualizar la cabecera.";
      swal("Error", msg, "error");
    } finally {
      setIsUpdating(false);
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
          await crud.DELETE(`/api/cabecera/${cabecera._id}`);
          swal("Éxito", "Cabecera eliminada correctamente.", "success");
          actualizarCabeceras();
          changeModalCabecera();
        } catch (error) {
          swal("Error", "No se pudo eliminar la cabecera.", "error");
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-lime-200 rounded-lg shadow-lg p-6 max-w-md w-full">
        <p className="text-xl font-bold text-gray-700 mb-4 text-center">
          CABECERA
        </p>

        <div className="space-y-4">
          {["local", "nit", "direccion", "telefono", "email"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium capitalize">
                {field}:
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={cabecera[field]}
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
            onClick={changeModalCabecera}
          >
            Cerrar
          </button>

          <button
            className={`flex justify-center items-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto ${
              isUpdating
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabeceraModal;
