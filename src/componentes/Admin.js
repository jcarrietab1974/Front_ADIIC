import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import crud from "../conexiones/crud";
import swal from "sweetalert";


const Admin = () => {
  const navigate = useNavigate();

  //Se crea una ruta segura verificando el token
  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      // console.log(token);
      if (!token) {
        navigate("/login");
      }
    };
    autenticarUsuario();
  }, [navigate]); //[] Se ejecuta solo una vez


 //Se utiliza para recibir todas las categorias que bienen
  const [categoria, setCategoria] = useState([]);

  //Se crea una funcion
  const cargarCategorias = async () => {
    const response = await crud.GET(`/api/categorias`);
    console.log(response);
    setCategoria(response.categoria);
  }
  //Apenas se ingrese se debe ejecutar para mostrar las categorias
  useEffect(() =>{
     cargarCategorias();
  },[]);//Para que solo se ejecute una vez

  const borrarCategoria = async (e, idCategoria) => {
    e.preventDefault();
    const response = await crud.DELETE(`/api/categorias/${idCategoria}`);
    console.log(response.msg);
    const mensaje = response.msg;
    if(mensaje=== "categoria eliminada"){
      
    swal({
      title: "Error",
      text: mensaje,
      icon: "error",
      button: {
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-danger",
          closeModal: true,
        },
      },
    });
    

    }
    
    window.location.reload();
    
  }

   
  const actualizarCategoria = async  (idCategoria) => {
  const response = await crud.PUT(`/api/categorias/${idCategoria}`);
    
  

  }

 

  return (
    <>
      <Header />
       <div className="md:flex md:min-h-screen">
          <Sidebar />
          <main className="flex-1">
               <h1
            className=" colum bg-gradient-to-r from-indigo-200 via-violet-700 to-indigo-200
          bg-clip-text font-display text-4xl tracking-tight text-transparent text-center"
          >
               Lista de categorias
              </h1>

          <div>
              <table>
                  <thead className="bg-white">
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>ID</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">

                    {
                      //Esta es la funcion de javaScrip que nos permite hacer dinamico
                      //la tabla, nos permite realizar el llenado automatico
                      categoria.map(
                        item =>
                          <tr key={item._id}>
                           <td><img src={item.imagen} width="150" height="150"></img></td>
                             <td>{item.nombre}</td>
                             <td>{item._id}</td>
                             <td>
                             <input
                                type="submit"
                                value="Eliminar"
                                className="bg-violet-600 mb-5 w-full py-3 px-4 text-white uppercase font-bold rounded hover:cursor-pointer"
                                onClick={(e) => borrarCategoria(e, item._id)} 
                              />  

                                <input
                                type="submit"
                                value="Actualizar"
                                className="bg-violet-600 mb-5 w-full py-3 px-4 text-white uppercase font-bold rounded hover:cursor-pointer"
                                onClick={actualizarCategoria(item._id)} 
                              />  

                                <input
                                type="submit"
                                value="Crear producto"
                                className="bg-violet-600 mb-5 w-full py-3 px-4 text-white uppercase font-bold rounded hover:cursor-pointer"
                              />  

                             </td>

                          </tr>
                      )
                    }


                  </tbody>

              </table>
          </div>
      </main>
    </div>
        
    </>
  );
};
export default Admin;
