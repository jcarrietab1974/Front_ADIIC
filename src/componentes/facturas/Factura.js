import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FacturaModal from "./FacturaModal";
import crud from "../../conexiones/crud";
import swal from "sweetalert";
import { jsPDF } from "jspdf";

// --- Funciones utilitarias ---
const formatearFecha = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDecimal = (valor) => {
  if (!valor) return "0";
  if (typeof valor === "object" && valor.$numberDecimal)
    return parseFloat(valor.$numberDecimal).toFixed(2);
  return parseFloat(valor).toFixed(2);
};

const getSucursalData = (id, sucursales = []) => {
  if (!id) return null;
  return sucursales.find((s) => s._id === id || s.id === id || s.value === id);
};

// --- Normalizador de productos para PDF ---
const normalizeFacturaProducto = (prod) => {
  const referencia =
    (prod.producto && prod.producto.referencia) ||
    prod.referencia ||
    prod.codigo ||
    "";

  const descripcion =
    prod.descripcionProducto ||
    prod.descripcion ||
    prod.nombre ||
    (prod.producto && prod.producto.nombre) ||
    "";

  const cantidad = prod.cantidadProducto || prod.cantidad || prod.cant || 1;
  const descuento = prod.descuentoProducto || prod.descuento || 0;

  let precioUnitario =
    (prod.precioProducto && prod.precioProducto.$numberDecimal
      ? parseFloat(prod.precioProducto.$numberDecimal)
      : prod.precioProducto) ||
    prod.precioUnitario ||
    prod.precio ||
    (prod.producto && prod.producto.precio) ||
    (prod.subtotal && cantidad
      ? parseFloat(prod.subtotal) / parseFloat(cantidad)
      : 0);

  let subtotal =
    (prod.subtotal && prod.subtotal.$numberDecimal
      ? parseFloat(prod.subtotal.$numberDecimal)
      : prod.subtotal) ||
    (typeof precioUnitario !== "undefined" && cantidad
      ? precioUnitario * cantidad
      : 0);

  let iva = prod.ivaProducto || prod.iva || 0;
  if (iva && iva.$numberDecimal) iva = parseFloat(iva.$numberDecimal);

  let ivaPorc = 0;
  if (iva && subtotal && subtotal * (1 - descuento / 100) !== 0) {
    ivaPorc = ((iva / (subtotal * (1 - descuento / 100))) * 100).toFixed(1);
  }

  let total =
    (prod.total && prod.total.$numberDecimal
      ? parseFloat(prod.total.$numberDecimal)
      : prod.total) || subtotal * (1 - descuento / 100) + (iva || 0);

  return {
    referencia,
    descripcion,
    cantidad,
    subtotal,
    descuento,
    iva,
    ivaPorc,
    precioUnitario,
    total,
  };
};

// --- Generar PDF estilo FacturaModal.js ---
const generarPDF = (factura, sucursales) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Factura de Venta", 105, 18, { align: "center" });

  // Sucursal
  let y = 26;
  doc.setFontSize(11);
  const sucursalObj = getSucursalData(
    factura.cabecera?._id || factura.cabecera,
    sucursales
  );
  if (sucursalObj) {
    doc.text(`${sucursalObj.local || ""}`, 105, y, { align: "center" });
    y += 6;
    doc.text(`NIT: ${sucursalObj.nit || ""}`, 105, y, { align: "center" });
    y += 6;
    doc.text(`Dirección: ${sucursalObj.direccion || ""}`, 105, y, {
      align: "center",
    });
    y += 6;
    doc.text(`Teléfono: ${sucursalObj.telefono || ""}`, 105, y, {
      align: "center",
    });
    y += 6;
    doc.text(`Email: ${sucursalObj.email || ""}`, 105, y, { align: "center" });
    y += 10;
  } else {
    doc.text("Sucursal: -", 105, y, { align: "center" });
    y += 10;
  }

  // Datos del cliente y factura
  doc.setFontSize(10);
  doc.text(`Cliente: ${factura.cliente?.nombre || ""}`, 15, y);
  doc.text(`NIT/CC: ${factura.cliente?.nit || ""}`, 15, y + 5);
  doc.text(`Dirección: ${factura.cliente?.direccion || ""}`, 15, y + 10);
  doc.text(`Ciudad: ${factura.cliente?.ciudad || ""}`, 15, y + 15);
  doc.text(`Teléfono: ${factura.cliente?.telefono || ""}`, 15, y + 20);
  doc.text(`Fecha: ${formatearFecha(factura.createdAt)}`, 15, y + 25);
  doc.text(`N° Factura: ${factura.numeroFactura || ""}`, 15, y + 30);

  // Tabla de productos
  let yTabla = y + 38;
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

  const productosRaw = factura.cuerpo || [];
  const productos = Array.isArray(productosRaw)
    ? productosRaw.map(normalizeFacturaProducto)
    : [];

  if (!productos.length) {
    doc.text("NO HAY PRODUCTOS EN ESTA FACTURA", 15, yTabla + 10);
  }

  productos.forEach((p) => {
    doc.text(`${p.referencia}`, 15, yTabla);
    doc.text(`${p.descripcion}`, 40, yTabla);
    doc.text(`${p.cantidad}`, 95, yTabla);
    doc.text(`${parseFloat(p.precioUnitario || 0).toFixed(2)}`, 110, yTabla);
    doc.text(`${p.descuento}`, 130, yTabla);
    doc.text(`${p.ivaPorc}`, 150, yTabla);
    doc.text(`${parseFloat(p.total || 0).toFixed(2)}`, 170, yTabla);
    yTabla += 6;
  });

  yTabla += 6;
  doc.text(
    `Subtotal: $${formatDecimal(
      factura.subtotal && factura.subtotal.$numberDecimal
        ? factura.subtotal.$numberDecimal
        : factura.subtotal
    )}`,
    140,
    yTabla
  );
  yTabla += 6;
  doc.text(
    `Descuento: $${formatDecimal(
      factura.descuento && factura.descuento.$numberDecimal
        ? factura.descuento.$numberDecimal
        : factura.descuento
    )}`,
    140,
    yTabla
  );
  yTabla += 6;
  doc.text(
    `IVA: $${formatDecimal(
      factura.iva && factura.iva.$numberDecimal
        ? factura.iva.$numberDecimal
        : factura.iva
    )}`,
    140,
    yTabla
  );
  yTabla += 6;
  doc.setFontSize(14);
  doc.text(
    `TOTAL: $${formatDecimal(
      factura.total && factura.total.$numberDecimal
        ? factura.total.$numberDecimal
        : factura.total
    )}`,
    140,
    yTabla
  );

  window.open(doc.output("bloburl"), "_blank");
};

const FacturaPage = () => {
  const [facturas, setFacturas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    fetchFacturas("/api/factura");
    fetchSucursales("/api/cabecera");
  }, []);

  const fetchFacturas = async (url) => {
    setIsLoading(true);
    try {
      const response = await crud.GET(url);
      if (response) {
        setFacturas(Array.isArray(response) ? response : [response]);
      } else {
        swal("Error", "No se pudieron cargar las facturas.", "error");
      }
    } catch (error) {
      swal("Error", "Error al cargar las facturas.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSucursales = async (url) => {
    try {
      const res = await crud.GET(url);
      if (Array.isArray(res)) setSucursales(res);
      else if (Array.isArray(res.cabeceras)) setSucursales(res.cabeceras);
      else if (res.data && Array.isArray(res.data.cabeceras))
        setSucursales(res.data.cabeceras);
      else if (Array.isArray(res.data)) setSucursales(res.data);
      else setSucursales([]);
    } catch (e) {
      setSucursales([]);
    }
  };

  const facturasFiltradas = facturas.filter((factura) => {
    const search = busqueda.toLowerCase();
    const noFactura = factura.numeroFactura?.toLowerCase() || "";
    const nitCliente = factura.cliente?.nit?.toLowerCase() || "";
    return noFactura.includes(search) || nitCliente.includes(search);
  });

  return (
    <>
      <Header />
      <div className="md:flex md:min-h-screen bg-lime-200">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="min-h-screen bg-lime-200">
            <div className="bg-lime-200 px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <p className="text-gray-800 font-bold text-lg md:text-xl">
                GESTIÓN DE FACTURAS
              </p>
            </div>
            {/* Barra de búsqueda */}
            <div className="p-4">
              <div className="md:flex md:justify-between md:items-center text-gray-800">
                <div className="flex items-center rounded-md bg-white shadow shadow-gray-200 my-3 w-full md:w-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 ml-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    type="text"
                    className="pl-2 pr-6 py-2 outline-none text-gray-800 placeholder-gray-400 w-full md:w-96 rounded-md"
                    placeholder="Buscar: N° de Factura o NIT"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                {/* Botón "Agregar" */}
                <button
                  className="my-3 md:mt-0 flex items-center gap-3 hover:bg-lime-500 px-3 py-2 rounded-xl font-bold"
                  onClick={() =>
                    FacturaModal(() => fetchFacturas("/api/factura"))
                  }
                >
                  Facturar Venta
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-9 h-9"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Tabla de Facturas */}
            <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
              {/* Encabezado */}
              <div
                className="px-4 py-3 border-b border-gray-200 text-gray-700 font-medium text-center"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 32px",
                }}
              >
                <div>Fecha</div>
                <div>No. de Factura</div>
                <div>Subtotal</div>
                <div>Descuento</div>
                <div>Total</div>
                <div></div>
              </div>
              {isLoading ? (
                <div className="text-center py-10">Cargando facturas...</div>
              ) : facturasFiltradas.length > 0 ? (
                facturasFiltradas.map((factura) => (
                  <div
                    className="px-4 py-2 border-b border-gray-100 text-gray-800 items-center text-center"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 32px",
                    }}
                    key={factura._id}
                  >
                    <div>{formatearFecha(factura.createdAt)}</div>
                    <div>{factura.numeroFactura}</div>
                    <div>
                      $
                      {formatDecimal(
                        factura.subtotal && factura.subtotal.$numberDecimal
                          ? factura.subtotal.$numberDecimal
                          : factura.subtotal
                      )}
                    </div>
                    <div>
                      $
                      {formatDecimal(
                        factura.descuento && factura.descuento.$numberDecimal
                          ? factura.descuento.$numberDecimal
                          : factura.descuento
                      )}
                    </div>
                    <div>
                      $
                      {formatDecimal(
                        factura.total && factura.total.$numberDecimal
                          ? factura.total.$numberDecimal
                          : factura.total
                      )}
                    </div>
                    <div className="flex justify-center items-center">
                      <button
                        className="text-blue-700 hover:text-blue-900 focus:outline-none"
                        onClick={() => generarPDF(factura, sucursales)}
                        title="Ver factura PDF"
                        aria-label="Ver factura PDF"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-lg">Sin Facturas</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FacturaPage;
