import swal from "sweetalert";
import crud from "../../conexiones/crud";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const getAuthToken = () => localStorage.getItem("token");

// ==================================================================
// ======== INICIO: FUNCIÓN AUXILIAR AÑADIDA ========
// ==================================================================

/**
 * Llama a la API para incrementar el contador de compras de un cliente.
 * No bloquea la UI y maneja sus propios errores en la consola.
 * @param {string} clienteId El ID del cliente.
 * @param {string} token El token de autenticación.
 */
const incrementarComprasCliente = async (clienteId, token) => {
  if (!clienteId) {
    console.warn(
      "No se proporcionó un ID de cliente para incrementar las compras."
    );
    return;
  }
  try {
    // Se realiza la llamada a la nueva ruta del backend
    await crud.PUT(`/api/clientes/incrementar-compra/${clienteId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      `Contador de compras incrementado para el cliente: ${clienteId}`
    );
  } catch (error) {
    // Si falla, solo lo mostramos en consola para no interrumpir el flujo del usuario
    console.error(
      "Error al intentar incrementar el contador de compras:",
      error.message
    );
  }
};

// ==================================================================
// ========= FIN: FUNCIÓN AUXILIAR AÑADIDA =========
// ==================================================================

// -- ESTILOS PERSONALIZADOS --
const style = document.createElement("style");
style.innerHTML = `
  .factura-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .swal-input, .swal-select {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .custom-swal {
    width: auto !important;
    min-width: 800px;
    max-width: 98vw !important;
    overflow-x: auto !important;
  }
  .suggestions {
    border: 1px solid #ccc;
    max-height: 100px;
    overflow-y: auto;
    background: white;
    position: absolute;
    z-index: 1000;
    width: 100%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  .suggestion-item {
    padding: 8px;
    cursor: pointer;
  }
  .suggestion-item:hover {
    background-color: #eee;
  }
  .swal-button--confirm {
    background-color: #84cc16 !important;
    color: white !important;
    text-transform: uppercase;
    font-weight: bold;
    border-radius: 0.5rem;
    margin-top: 0.75rem;
    display: flex;
    justify-content: center;
    transition: background-color 0.3s;
  }
  .swal-button--confirm:hover {
    background-color: #65a30d !important;
  }
  .swal-button--cancel {
    background-color: #f87171 !important;
    color: white !important;
    text-transform: uppercase;
    font-weight: bold;
    border-radius: 0.5rem;
    margin-top: 0.75rem;
    display: flex;
    justify-content: center;
    transition: background-color 0.3s;
  }
  .swal-button--cancel:hover {
    background-color: #b91c1c !important;
  }
  table, th, td {
    border: 1px solid #ccc;
    padding: 6px;
    text-align: center;
    white-space: nowrap;
  }
  tfoot td {
    font-weight: bold;
    background-color: #f0f0f0;
  }
  .error-global-stock {
    color: red;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }
`;
document.head.appendChild(style);

// -- COMPONENTE PRINCIPAL --
const FacturaModal = async (estadoPrevio = {}) => {
  const token = getAuthToken();
  if (!token) {
    swal("Error", "No hay token de autenticación.", "error");
    return;
  }

  // Variables de estado
  let productos = Array.isArray(estadoPrevio.productos)
    ? [...estadoPrevio.productos]
    : [];
  let cantidades = Array.isArray(estadoPrevio.cantidades)
    ? [...estadoPrevio.cantidades]
    : [];
  let descuentos = Array.isArray(estadoPrevio.descuentos)
    ? [...estadoPrevio.descuentos]
    : [];
  let ivas = Array.isArray(estadoPrevio.ivas) ? [...estadoPrevio.ivas] : [];
  let listadoProductos = [];
  let clienteSeleccionado = estadoPrevio.clienteSeleccionado || null;
  let datosOriginalesCliente = estadoPrevio.datosOriginalesCliente || null;

  // --- Cargar sucursales y productos ---
  const obtenerSucursales = async () => {
    const res = await crud.GET("/api/cabecera");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.cabeceras)) return res.cabeceras;
    if (res.data && Array.isArray(res.data.cabeceras))
      return res.data.cabeceras;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };
  const obtenerProductos = async () => {
    const res = await crud.GET("/api/productos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const prods = res.data?.productos || res.productos || [];
    listadoProductos = prods.filter((p) => p.nombre && p.referencia);
  };
  let sucursales = [];
  try {
    sucursales = await obtenerSucursales();
    await obtenerProductos();
    if (!Array.isArray(sucursales)) sucursales = [];
  } catch (e) {
    swal("Error", "No se pudieron cargar los datos necesarios.", "error");
    return;
  }

  // --- UI ---
  const formContainer = document.createElement("div");
  const errorGlobalStock = document.createElement("div");
  errorGlobalStock.className = "error-global-stock";
  errorGlobalStock.style.display = "none";
  formContainer.appendChild(errorGlobalStock);

  const labelCabecera = document.createElement("h4");
  labelCabecera.textContent = "Cabecera de Factura";
  formContainer.appendChild(labelCabecera);

  const selectSucursal = document.createElement("select");
  selectSucursal.className = "swal-select";
  selectSucursal.innerHTML =
    "<option value=''>Seleccione una sucursal</option>";
  sucursales.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s._id || s.id || s.value || "";
    opt.textContent = `${s.local || s.nombre || "Sucursal"} - ${
      s.direccion || ""
    }`;
    if (estadoPrevio.sucursal && opt.value === estadoPrevio.sucursal) {
      opt.selected = true;
    }
    selectSucursal.appendChild(opt);
  });
  formContainer.appendChild(selectSucursal);

  // --- Datos Cliente ---
  const labelCliente = document.createElement("h4");
  labelCliente.textContent = "Datos del Cliente";
  labelCliente.style.marginTop = "20px";
  formContainer.appendChild(labelCliente);

  const clienteDiv = document.createElement("div");
  clienteDiv.className = "factura-grid";
  const clienteNombre = document.createElement("input");
  clienteNombre.placeholder = "Nombre y Apellidos";
  clienteNombre.className = "swal-input";
  clienteNombre.value = estadoPrevio.clienteNombre || "";
  const clienteNit = document.createElement("input");
  clienteNit.placeholder = "NIT o CC";
  clienteNit.className = "swal-input";
  clienteNit.value = estadoPrevio.clienteNit || "";
  const clienteDireccion = document.createElement("input");
  clienteDireccion.placeholder = "Dirección";
  clienteDireccion.className = "swal-input";
  clienteDireccion.value = estadoPrevio.clienteDireccion || "";
  const clienteCiudad = document.createElement("input");
  clienteCiudad.placeholder = "Ciudad";
  clienteCiudad.className = "swal-input";
  clienteCiudad.value = estadoPrevio.clienteCiudad || "";
  const clienteTelefono = document.createElement("input");
  clienteTelefono.placeholder = "Teléfono";
  clienteTelefono.className = "swal-input";
  clienteTelefono.value = estadoPrevio.clienteTelefono || "";
  const sugerenciasCliente = document.createElement("div");
  sugerenciasCliente.className = "suggestions";
  sugerenciasCliente.style.display = "none";

  // Autocompletar cliente
  const manejarBusquedaCliente = async () => {
    const query = (
      clienteNombre.value.trim() || clienteNit.value.trim()
    ).toLowerCase();
    if (!query) {
      sugerenciasCliente.innerHTML = "";
      sugerenciasCliente.style.display = "none";
      clienteSeleccionado = null;
      datosOriginalesCliente = null;
      return;
    }
    try {
      const res = await crud.GET("/api/clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const clientes = res.clientes || [];
      const coincidencias = clientes.filter(
        (c) =>
          (c.nombre && c.nombre.toLowerCase().includes(query)) ||
          (c.nit && c.nit.toLowerCase().includes(query))
      );
      sugerenciasCliente.innerHTML = "";
      coincidencias.forEach((cliente) => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.textContent = `${cliente.nombre} (${cliente.nit})`;
        item.addEventListener("click", () => {
          clienteNombre.value = cliente.nombre;
          clienteNit.value = cliente.nit;
          clienteDireccion.value = cliente.direccion || "";
          clienteCiudad.value = cliente.ciudad || "";
          clienteTelefono.value = cliente.telefono || "";
          clienteSeleccionado = cliente;
          datosOriginalesCliente = {
            nombre: cliente.nombre,
            nit: cliente.nit,
            direccion: cliente.direccion,
            ciudad: cliente.ciudad,
            telefono: cliente.telefono,
            _id: cliente._id,
          };
          sugerenciasCliente.style.display = "none";
        });
        sugerenciasCliente.appendChild(item);
      });
      sugerenciasCliente.style.display = coincidencias.length
        ? "block"
        : "none";
    } catch (err) {
      sugerenciasCliente.innerHTML = "";
      sugerenciasCliente.style.display = "none";
      clienteSeleccionado = null;
      datosOriginalesCliente = null;
    }
  };
  clienteNombre.addEventListener("input", manejarBusquedaCliente);
  clienteNit.addEventListener("input", manejarBusquedaCliente);
  clienteDiv.append(
    clienteNombre,
    clienteNit,
    clienteDireccion,
    clienteCiudad,
    clienteTelefono,
    sugerenciasCliente
  );
  formContainer.appendChild(clienteDiv);

  // --- Productos ---
  const labelProducto = document.createElement("h4");
  labelProducto.textContent = "Buscar y Escoger Productos";
  labelProducto.style.marginTop = "20px";
  formContainer.appendChild(labelProducto);

  const inputBusqueda = document.createElement("input");
  inputBusqueda.placeholder = "Buscar por nombre o referencia";
  inputBusqueda.className = "swal-input";
  const sugerencias = document.createElement("div");
  sugerencias.className = "suggestions";
  sugerencias.style.display = "none";
  const tablaProductos = document.createElement("table");
  tablaProductos.innerHTML = `
    <thead style="background-color: #2c6ca0; color: white;">
      <tr>
        <th>Código</th>
        <th>Descripción</th>
        <th>Unidad</th>
        <th>Cantidad</th>
        <th>Valor Unitario</th>
        <th>% Dscto</th>
        <th>% IVA</th>
        <th>Total</th>
        <th>Eliminar</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
      <tr>
        <td colspan="4">Resumen:</td>
        <td id="subtotal" style="text-align: right">$0.00</td>
        <td id="descuento" style="text-align: right">$0.00</td>
        <td id="ivaTotal" style="text-align: right">$0.00</td>
        <td id="totalFactura" style="text-align: right">$0.00</td>
        <td></td>
      </tr>
    </tfoot>`;

  // --- Calcular totales y sincronizar arrays ---
  const calcularTotales = () => {
    let subtotal = 0,
      descuentoTotal = 0,
      ivaTotal = 0,
      total = 0;
    const filas = tablaProductos.querySelectorAll("tbody tr");
    filas.forEach((fila, idx) => {
      const cantidad =
        parseFloat(fila.children[3].querySelector("input").value) || 1;
      const descuento =
        parseFloat(fila.children[5].querySelector("input").value) || 0;
      const ivaPorcentaje =
        parseFloat(fila.children[6].querySelector("input").value) || 0;
      const producto = listadoProductos.find(
        (prod) =>
          prod.referencia === fila.children[0].textContent &&
          prod.nombre === fila.children[1].textContent
      );
      const precioUnitario = producto ? parseFloat(producto.precio) : 0;
      const valorBase = cantidad * precioUnitario;
      const valorConDescuento = valorBase * (1 - descuento / 100);
      const iva = valorConDescuento * (ivaPorcentaje / 100);
      const totalProducto = valorConDescuento + iva;
      subtotal += valorBase;
      descuentoTotal += valorBase * (descuento / 100);
      ivaTotal += iva;
      total += totalProducto;
      fila.children[7].textContent = `$${totalProducto.toFixed(2)}`;
    });
    // Totales en tabla
    const subtotalCell = tablaProductos.querySelector("#subtotal");
    const descuentoCell = tablaProductos.querySelector("#descuento");
    const ivaTotalCell = tablaProductos.querySelector("#ivaTotal");
    const totalFacturaCell = tablaProductos.querySelector("#totalFactura");
    if (subtotalCell) subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
    if (descuentoCell)
      descuentoCell.textContent = `$${descuentoTotal.toFixed(2)}`;
    if (ivaTotalCell) ivaTotalCell.textContent = `$${ivaTotal.toFixed(2)}`;
    if (totalFacturaCell) totalFacturaCell.textContent = `$${total.toFixed(2)}`;
  };
  const sincronizarArraysDesdeTabla = () => {
    const filas = Array.from(tablaProductos.querySelectorAll("tbody tr"));
    productos = filas.map((f) =>
      listadoProductos.find(
        (prod) =>
          prod.referencia === f.children[0].textContent &&
          prod.nombre === f.children[1].textContent
      )
    );
    cantidades = filas.map(
      (f) => parseInt(f.children[3].querySelector("input").value) || 1
    );
    descuentos = filas.map(
      (f) => parseFloat(f.children[5].querySelector("input").value) || 0
    );
    ivas = filas.map(
      (f) => parseFloat(f.children[6].querySelector("input").value) || 0
    );
  };

  // --- Renderizar productos previamente seleccionados
  if (productos.length > 0) {
    productos.forEach((p, idx) => {
      const cantidad = cantidades[idx] || 1;
      const descuento = descuentos[idx] || 0;
      const iva = ivas[idx] || 0;
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.referencia}</td>
        <td>${p.nombre}</td>
        <td>${p.unidad || "Und"}</td>
        <td>
          <input type="number" value="${cantidad}" min="1" max="${
        p.stock
      }" class="swal-input" style="width: 80px;">
        </td>
        <td>${p.precio}</td>
        <td><input type="number" value="${descuento}" min="0" max="100" class="swal-input" style="width: 80px;"></td>
        <td><input type="number" value="${iva}" min="0" max="100" class="swal-input" style="width: 80px;"></td>
        <td>$0.00</td>
        <td><button class="swal-button--cancel">X</button></td>
      `;
      const cantidadInput = fila.children[3].querySelector("input");
      const errorMsg = document.createElement("div");
      errorMsg.style.color = "red";
      errorMsg.style.fontSize = "12px";
      errorMsg.style.marginTop = "2px";
      errorMsg.style.display = "none";
      errorMsg.textContent = `Solo hay ${p.stock} unidades disponibles`;
      fila.children[3].appendChild(errorMsg);
      cantidadInput.addEventListener("input", () => {
        const cantidad = parseInt(cantidadInput.value) || 1;
        if (cantidad > p.stock) {
          errorMsg.style.display = "block";
          cantidadInput.style.borderColor = "red";
        } else {
          errorMsg.style.display = "none";
          cantidadInput.style.borderColor = "";
        }
        sincronizarArraysDesdeTabla();
        calcularTotales();
      });
      const descuentoInput = fila.children[5].querySelector("input");
      descuentoInput.addEventListener("input", () => {
        sincronizarArraysDesdeTabla();
        calcularTotales();
      });
      const ivaInput = fila.children[6].querySelector("input");
      ivaInput.addEventListener("input", () => {
        sincronizarArraysDesdeTabla();
        calcularTotales();
      });
      fila.querySelector("button").addEventListener("click", () => {
        fila.remove();
        sincronizarArraysDesdeTabla();
        calcularTotales();
      });
      tablaProductos.querySelector("tbody").appendChild(fila);
    });
    calcularTotales();
  }

  // --- Filtrado y sugerencias productos (añadir productos nuevos)
  inputBusqueda.addEventListener("input", () => {
    const valor = inputBusqueda.value.toLowerCase();
    sugerencias.innerHTML = "";
    if (!valor) {
      sugerencias.style.display = "none";
      return;
    }
    const encontrados = listadoProductos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(valor) ||
        p.referencia?.toLowerCase().includes(valor)
    );
    encontrados.forEach((p) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.textContent = `${p.nombre} - ${p.referencia}`;
      item.addEventListener("click", () => {
        productos.push(p);
        cantidades.push(1);
        descuentos.push(0);
        ivas.push(0);
        const idx = productos.length - 1;
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.referencia}</td>
          <td>${p.nombre}</td>
          <td>${p.unidad || "Und"}</td>
          <td>
            <input type="number" value="1" min="1" max="${
              p.stock
            }" class="swal-input" style="width: 80px;">
          </td>
          <td>${p.precio}</td>
          <td><input type="number" value="0" min="0" max="100" class="swal-input" style="width: 80px;"></td>
          <td><input type="number" value="0" min="0" max="100" class="swal-input" style="width: 80px;"></td>
          <td>$0.00</td>
          <td><button class="swal-button--cancel">X</button></td>
        `;
        const cantidadInput = fila.children[3].querySelector("input");
        const errorMsg = document.createElement("div");
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "12px";
        errorMsg.style.marginTop = "2px";
        errorMsg.style.display = "none";
        errorMsg.textContent = `Solo hay ${p.stock} unidades disponibles`;
        fila.children[3].appendChild(errorMsg);
        cantidadInput.addEventListener("input", () => {
          const cantidad = parseInt(cantidadInput.value) || 1;
          if (cantidad > p.stock) {
            errorMsg.style.display = "block";
            cantidadInput.style.borderColor = "red";
          } else {
            errorMsg.style.display = "none";
            cantidadInput.style.borderColor = "";
          }
          sincronizarArraysDesdeTabla();
          calcularTotales();
        });
        const descuentoInput = fila.children[5].querySelector("input");
        descuentoInput.addEventListener("input", () => {
          sincronizarArraysDesdeTabla();
          calcularTotales();
        });
        const ivaInput = fila.children[6].querySelector("input");
        ivaInput.addEventListener("input", () => {
          sincronizarArraysDesdeTabla();
          calcularTotales();
        });
        fila.querySelector("button").addEventListener("click", () => {
          fila.remove();
          sincronizarArraysDesdeTabla();
          calcularTotales();
        });
        tablaProductos.querySelector("tbody").appendChild(fila);
        sincronizarArraysDesdeTabla();
        calcularTotales();
        inputBusqueda.value = "";
        sugerencias.style.display = "none";
      });
      sugerencias.appendChild(item);
    });
    sugerencias.style.display = encontrados.length ? "block" : "none";
  });

  formContainer.append(inputBusqueda, sugerencias, tablaProductos);

  // --- Mostrar modal con SweetAlert ---
  swal({
    title: "Crear Factura",
    content: formContainer,
    buttons: {
      cancel: { text: "Cancelar", visible: true, closeModal: true },
      confirm: { text: "Guardar", closeModal: false },
    },
    className: "custom-swal",
  }).then(async (confirm) => {
    if (!confirm) return;
    if (productos.length === 0) {
      swal("Error", "Debes agregar al menos un producto.", "error");
      return;
    }
    if (!selectSucursal.value) {
      swal("Error", "Debes seleccionar una sucursal.", "error");
      return;
    }
    if (!clienteNombre.value.trim() || !clienteNit.value.trim()) {
      swal("Error", "Debes ingresar nombre y NIT del cliente.", "error");
      return;
    }

    let esClienteNuevo = false; // <<< PASO 1: Declarar la bandera aquí

    // --- Cliente ---
    const clienteData = {
      nombre: clienteNombre.value.trim(),
      nit: clienteNit.value.trim(),
      direccion: clienteDireccion.value.trim(),
      ciudad: clienteCiudad.value.trim(),
      telefono: clienteTelefono.value.trim(),
    };
    let clienteIdAUsar = null;
    if (
      clienteSeleccionado &&
      datosOriginalesCliente &&
      (clienteData.nombre !== datosOriginalesCliente.nombre ||
        clienteData.nit !== datosOriginalesCliente.nit ||
        clienteData.direccion !== datosOriginalesCliente.direccion ||
        clienteData.ciudad !== datosOriginalesCliente.ciudad ||
        clienteData.telefono !== datosOriginalesCliente.telefono)
    ) {
      const actualizar = await swal({
        title: "Actualizar cliente",
        text: "Has modificado datos del cliente guardado. ¿Deseas actualizar los datos en la base de datos?",
        icon: "warning",
        buttons: {
          cancel: {
            text: "No, mantener originales",
            visible: true,
            closeModal: true,
          },
          confirm: { text: "Sí, actualizar", closeModal: true },
        },
        dangerMode: true,
      });
      if (actualizar) {
        try {
          const resActualizar = await crud.PUT(
            `/api/clientes/${clienteSeleccionado._id}`,
            clienteData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          clienteIdAUsar =
            resActualizar.cliente?._id || clienteSeleccionado._id;
        } catch (error) {
          swal("Error", "No se pudo actualizar el cliente.", "error");
          return;
        }
      } else {
        clienteIdAUsar = clienteSeleccionado._id;
      }
    } else if (clienteSeleccionado && datosOriginalesCliente) {
      clienteIdAUsar = clienteSeleccionado._id;
    } else {
      try {
        const res = await crud.GET("/api/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clientes = res.clientes || [];
        const clienteEncontrado = clientes.find(
          (c) =>
            c.nit &&
            c.nit.trim().toLowerCase() === clienteData.nit.toLowerCase()
        );
        if (clienteEncontrado) {
          clienteIdAUsar = clienteEncontrado._id;
        } else {
          const crearCliente = await swal({
            title: "Crear cliente",
            text: "El cliente no existe, ¿deseas CREAR este cliente?",
            icon: "warning",
            buttons: {
              cancel: { text: "Cancelar", visible: true, closeModal: true },
              confirm: { text: "Sí, crear", closeModal: true },
            },
            dangerMode: true,
          });
          if (!crearCliente) return;
          const resCrear = await crud.POST("/api/clientes", clienteData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          clienteIdAUsar = resCrear.cliente?._id || null;

          if (clienteIdAUsar) {
            esClienteNuevo = true; // <<< PASO 2: Marcar al cliente como nuevo
          }

          if (!clienteIdAUsar) {
            const resBuscar = await crud.GET("/api/clientes", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const clientesActualizados = resBuscar.clientes || [];
            const nuevoCliente = clientesActualizados.find(
              (c) =>
                c.nit &&
                c.nit.trim().toLowerCase() === clienteData.nit.toLowerCase()
            );
            if (nuevoCliente) clienteIdAUsar = nuevoCliente._id;
          }
          if (!clienteIdAUsar) {
            swal("Error", "No se pudo crear el cliente.", "error");
            return;
          }
        }
      } catch (error) {
        swal("Error", "No se pudo verificar o crear el cliente.", "error");
        return;
      }
    }

    // --- Validar stock antes de enviar la factura ---
    sincronizarArraysDesdeTabla();
    let stockValido = true;
    for (let i = 0; i < productos.length; i++) {
      if (cantidades[i] > (productos[i]?.stock ?? 0)) {
        stockValido = false;
        break;
      }
    }
    if (!stockValido) {
      errorGlobalStock.textContent =
        "Uno o más productos no tienen suficiente stock. Corrige las cantidades marcadas en rojo.";
      errorGlobalStock.style.display = "block";
      return;
    } else {
      errorGlobalStock.textContent = "";
      errorGlobalStock.style.display = "none";
    }

    // --- PREPARAR productosParaEnviar con subtotal, iva y total por producto ---
    const productosParaEnviar = productos.map((producto, i) => {
      const cantidad = cantidades[i];
      const precioUnitario = parseFloat(producto.precio);
      const descuento = descuentos[i] || 0;
      const ivaPorcentaje = ivas[i] || 0;
      const valorBase = cantidad * precioUnitario;
      const valorConDescuento = valorBase * (1 - descuento / 100);
      const iva = valorConDescuento * (ivaPorcentaje / 100);
      const total = valorConDescuento + iva;
      return {
        producto: producto._id,
        referencia: producto.referencia, // <-- AGREGADO
        cantidad: cantidad,
        descuento: descuento,
        descripcion: producto.nombre,
        subtotal: valorBase,
        iva: iva,
        total: total,
      };
    });

    // Totales de la tabla
    const subtotal =
      parseFloat(
        tablaProductos
          .querySelector("#subtotal")
          .textContent.replace(/[^0-9.-]+/g, "")
      ) || 0;
    const descuentoFactura =
      parseFloat(
        tablaProductos
          .querySelector("#descuento")
          .textContent.replace(/[^0-9.-]+/g, "")
      ) || 0;
    const ivaFactura =
      parseFloat(
        tablaProductos
          .querySelector("#ivaTotal")
          .textContent.replace(/[^0-9.-]+/g, "")
      ) || 0;
    const total =
      parseFloat(
        tablaProductos
          .querySelector("#totalFactura")
          .textContent.replace(/[^0-9.-]+/g, "")
      ) || 0;

    const datosFactura = {
      cliente: clienteIdAUsar,
      cabecera: selectSucursal.value,
      productos: productosParaEnviar,
      subtotal,
      descuento: descuentoFactura,
      iva: ivaFactura,
      total,
    };

    // --- ENVÍO Y PDF ---
    try {
      const resp = await crud.POST("/api/factura", datosFactura, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp && resp.ok) {
        // ===============================================================
        // ============= INICIO: LLAMADA A LA NUEVA FUNCIÓN =============
        // ===============================================================

        // Una vez que la factura se guarda con éxito, se llama a la función
        // para incrementar el contador de compras del cliente.
        // Lo hacemos sin 'await' aquí para que no bloquee la generación del PDF.
        incrementarComprasCliente(datosFactura.cliente, token);

        // ===============================================================
        // ============== FIN: LLAMADA A LA NUEVA FUNCIÓN ==============
        // ===============================================================

        // --- GENERAR PDF con jsPDF ---
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Factura de Venta", 105, 18, { align: "center" });

        // -------- SUCURSAL DEBAJO DEL TITULO --------
        let y = 26;
        doc.setFontSize(11);

        const sucursalIdSeleccionada = selectSucursal.value;
        const sucursalObj = sucursales.find(
          (s) => (s._id || s.id) === sucursalIdSeleccionada
        );

        if (sucursalObj) {
          doc.text(`${sucursalObj.local}`, 105, y, {
            align: "center",
          });
          y += 6;
          doc.text(`NIT: ${sucursalObj.nit}`, 105, y, { align: "center" });
          y += 6;
          doc.text(`Dirección: ${sucursalObj.direccion}`, 105, y, {
            align: "center",
          });
          y += 6;
          doc.text(`Teléfono: ${sucursalObj.telefono}`, 105, y, {
            align: "center",
          });
          y += 6;
          doc.text(`Email: ${sucursalObj.email}`, 105, y, { align: "center" });
          y += 10; // Espacio extra antes del cliente
        } else {
          doc.text("Sucursal: -", 105, y, { align: "center" });
          y += 10;
        }

        // -------- DATOS DEL CLIENTE Y FACTURA (como siempre) --------
        doc.setFontSize(10);
        doc.text(`Cliente: ${clienteNombre.value}`, 15, y);
        doc.text(`NIT/CC: ${clienteNit.value}`, 15, y + 5);
        doc.text(`Dirección: ${clienteDireccion.value}`, 15, y + 10);
        doc.text(`Ciudad: ${clienteCiudad.value}`, 15, y + 15);
        doc.text(`Teléfono: ${clienteTelefono.value}`, 15, y + 20);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 15, y + 25);
        if (resp.factura && resp.factura.numeroFactura)
          doc.text(`N° Factura: ${resp.factura.numeroFactura}`, 15, y + 30);

        // -------- TABLA DE PRODUCTOS --------
        let yTabla = y + 38; // Espacio suficiente después de datos del cliente
        doc.setFontSize(12);
        doc.text("Productos:", 15, yTabla);
        yTabla += 7;

        doc.setFontSize(10);
        doc.text("Código", 15, yTabla);
        doc.text("Descripción", 40, yTabla);
        doc.text("Cant", 95, yTabla);
        doc.text("V.Unit", 110, yTabla);
        doc.text("Dscto%", 130, yTabla);
        doc.text("IVA%", 150, yTabla);
        doc.text("Total", 170, yTabla);
        yTabla += 6;

        productosParaEnviar.forEach((p) => {
          doc.text(`${p.referencia}`, 15, yTabla); // <-- AHORA MUESTRA LA REFERENCIA
          doc.text(`${p.descripcion}`, 40, yTabla);
          doc.text(`${p.cantidad}`, 95, yTabla);
          doc.text(
            `${parseFloat(p.subtotal / p.cantidad).toFixed(2)}`,
            110,
            yTabla
          );
          doc.text(`${p.descuento}`, 130, yTabla);
          doc.text(
            `${((p.iva / (p.subtotal * (1 - p.descuento / 100))) * 100).toFixed(
              1
            )}`,
            150,
            yTabla
          );
          doc.text(`${p.total.toFixed(2)}`, 170, yTabla);
          yTabla += 6;
        });

        yTabla += 6;
        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, yTabla);
        yTabla += 6;
        doc.text(`Descuento: $${descuentoFactura.toFixed(2)}`, 140, yTabla);
        yTabla += 6;
        doc.text(`IVA: $${ivaFactura.toFixed(2)}`, 140, yTabla);
        yTabla += 6;
        doc.setFontSize(14);
        doc.text(`TOTAL: $${total.toFixed(2)}`, 140, yTabla);

        doc.save(
          `Factura_${
            resp.factura && resp.factura.numeroFactura
              ? resp.factura.numeroFactura
              : Date.now()
          }.pdf`
        );
        swal("Éxito", "Factura guardada y PDF generado.", "success");
      } else {
        swal(
          "Error",
          resp && resp.msg ? resp.msg : "No se pudo guardar la factura.",
          "error"
        );
      }
    } catch (error) {
      swal(
        "Error",
        "No se pudo guardar la factura (error de red o backend).",
        "error"
      );
      console.error(error);
    }
  });
};

export default FacturaModal;
