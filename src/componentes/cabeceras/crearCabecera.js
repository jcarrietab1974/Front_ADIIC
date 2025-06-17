import swal from "sweetalert";
import crud from "../../conexiones/crud";

// Obtener el token de autenticación
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

// Agregar estilos dinámicos para el modal
const style = document.createElement("style");
style.innerHTML = `
  .custom-swal {
    background-color: #d9f99d !important;
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
  // Crear contenedor del formulario
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

  // Mostrar el modal de SweetAlert con los campos
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
    className: "custom-swal",
  }).then(async (confirm) => {
    if (!confirm) return;

    // Recolectar y validar campos
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

      // Si la respuesta es exitosa
      if (response && response.cabecera) {
        swal("Éxito", "Cabecera creada correctamente.", "success");
        actualizarCabeceras();
      } else {
        throw new Error("Error inesperado");
      }
    } catch (error) {
      // Manejo de error detallado
      const mensajeError =
        error.response?.data?.msg ||
        "No se pudo crear la cabecera, el Nit ya existe";
      swal("Error", mensajeError, "error");
    }
  });
};

export default crearCabecera;
