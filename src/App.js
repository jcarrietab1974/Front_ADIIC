import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./componentes/Login";
import CrearCuenta from "./componentes/CrearCuenta";
import Admin from "./componentes/Admin";
import Home from "./componentes/Home";
import CrearCategoria from "./componentes/CrearCategoria";
import ActualizarCategoria from "./componentes/categorias/ActualizaCategoria";
import HomeProductos from "./componentes/productos/HomeProductos";
import CrearProductos from "./componentes/productos/CrearProductos";
import ActualizarProductos from "./componentes/productos/ActualizarProductos";
import Regular from "./componentes/Regular";
import RegularProductos from "./componentes/RegularProductos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/crear-cuenta" exact element={<CrearCuenta />} />
        <Route path="/admin" exact element={<Admin />} />
        <Route path="/regular" exact element={<Regular />} />
        <Route path="/regproducto/:id" exact element={<RegularProductos />} />
        <Route path="/crear-categoria" exact element={<CrearCategoria />} />
        <Route
          path="/actualizar-categoria/:idCategoria"
          exact
          element={<ActualizarCategoria />}
        />
        <Route
          path="/home-productos/:idCategoria"
          exact
          element={<HomeProductos />}
        />
        <Route
          path="/crear-producto/:idCategoria"
          exact
          element={<CrearProductos />}
        />
        <Route
          path="/actualizar-producto/:idProducto"
          exact
          element={<ActualizarProductos />}
        />
      </Routes>
    </Router>
  );
}
export default App;
