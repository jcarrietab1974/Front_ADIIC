import React from "react";
<<<<<<< HEAD
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
=======
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
>>>>>>> 63147b37533bdd16aa1e591ed6fe4ebf80d87542
import Login from "./componentes/Login";
import CrearCuenta from "./componentes/CrearCuenta";

function App() {
  return (
<<<<<<< HEAD
   <Router>
     <Routes>
       <Route path="/" exact element = {<Login/>}/>
       <Route path="/crear-cuenta" exact element = {<CrearCuenta/>}/>

     </Routes>
   </Router>
=======
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/crear-cuenta" exact element={<CrearCuenta />} />
      </Routes>
    </Router>
>>>>>>> 63147b37533bdd16aa1e591ed6fe4ebf80d87542
  );
}
export default App;
