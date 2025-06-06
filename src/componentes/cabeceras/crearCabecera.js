import swal from "sweetalert";
import crud from "../../conexiones/crud";

// Obtener el token de autenticación
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token obtenido:", token);
  return token;
};

// Agregar estilos dinámicos para el modal
const style = document.createElement("style");
style.innerHTML = `
  .custom-swal {
    background-color: #d9f99d !important; /* Equivalente a bg-lime-200 */
    border-radius: 0.5rem !important;
    padding: 1.5rem !important;
  }
  .swal-footer {
    display: flex !important;
    justify-content: center !important;
  }
`;
document.head.appendChild(style);

const crearCabecera = async (actualizarCabeceras) => {
  // Crear contenedor dinámico con los campos
  const formContainer = document.createElement("div");
  formContainer.className =
    "bg-lime-200 p-6 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full flex flex-col gap-4";

  const campos = [
    { id: "swal-local", placeholder: "Local", type: "text" },
    { id: "swal-nit", placeholder: "NIT", type: "text" },
    { id: "swal-direccion", placeholder: "Dirección", type: "text" },
    { id: "swal-telefono", placeholder: "Teléfono", type: "text" },
    { id: "swal-email", placeholder: "Email", type: "email" },
  ];

  campos.forEach(({ id, placeholder, type }) => {
    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.placeholder = placeholder;
    input.className =
      "swal-input bg-white p-2 rounded-md w-full border border-gray-300 focus:ring-2 focus:ring-green-500";
    formContainer.appendChild(input);
  });

  // Mostrar la alerta con el formulario dinámico
  swal({
    title: "Crear Cabecera",
    content: formContainer,
    buttons: {
      cancel: {
        text: "Cancelar",
        value: null,
        visible: true,
        className: "bg-red-500 text-white p-2 rounded-md w-full sm:w-auto",
      },
      confirm: {
        text: "Guardar",
        value: true,
        visible: true,
        className: "bg-green-500 text-white p-2 rounded-md w-full sm:w-auto",
      },
    },
    className: "custom-swal", // Aplicamos la clase para modificar el modal
  }).then(async (confirm) => {
    if (!confirm) return;

    // Obtener los valores ingresados
    const valores = {};
    let camposValidos = true;

    campos.forEach(({ id }) => {
      valores[id] = document.getElementById(id).value.trim();
      if (!valores[id]) camposValidos = false;
    });

    if (!camposValidos) {
      swal("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        swal(
          "Error",
          "No estás autenticado. Por favor inicia sesión.",
          "error"
        );
        return;
      }

      const response = await crud.POST(
        "/api/cabecera",
        {
          local: valores["swal-local"],
          nit: valores["swal-nit"],
          direccion: valores["swal-direccion"],
          telefono: valores["swal-telefono"],
          email: valores["swal-email"],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response) {
        swal("Éxito", "Cabecera creada correctamente.", "success");
        actualizarCabeceras();
      } else {
        throw new Error("Error al crear la cabecera");
      }
    } catch (error) {
      swal("Error", "No se pudo crear la cabecera.", "error");
    }
  });
};

export default crearCabecera;
