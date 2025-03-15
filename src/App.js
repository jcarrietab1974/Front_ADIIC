import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./componentes/Login";
import CrearCuenta from "./componentes/CrearCuenta";
import Admin from "./componentes/Admin";
import Home from "./componentes/Home";
import Regular from "./componentes/Regular";
import RegularProductos from "./componentes/RegularProductos";

// Categorías
import CrearCategoria from "./componentes/CrearCategoria";
import ActualizarCategoria from "./componentes/categorias/ActualizaCategoria";

// Productos
import HomeProductos from "./componentes/productos/HomeProductos";
import CrearProductos from "./componentes/productos/CrearProductos";
import ActualizarProductos from "./componentes/productos/ActualizarProductos";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas principales */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/regular" element={<Regular />} />

        {/* Rutas de Categorías */}
        <Route path="/crear-categoria" element={<CrearCategoria />} />
        <Route
          path="/actualizar-categoria/:idCategoria"
          element={<ActualizarCategoria />}
        />

        {/* Rutas de Productos */}
        <Route
          path="/home-productos/:idCategoria"
          element={<HomeProductos />}
        />
        <Route
          path="/crear-producto/:idCategoria"
          element={<CrearProductos />}
        />
        <Route
          path="/actualizar-producto/:idProducto"
          element={<ActualizarProductos />}
        />

        {/* Rutas de Productos en modo regular */}
        <Route path="/regproducto/:id" element={<RegularProductos />} />
      </Routes>
    </Router>
  );
}

export default App;
