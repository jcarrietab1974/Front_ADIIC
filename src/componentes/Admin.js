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
  };
  //Apenas se ingrese se debe ejecutar para mostrar las categorias
  useEffect(() => {
    cargarCategorias();
  }, []); //Para que solo se ejecute una vez

  const borrarCategoria = async (e, idCategoria) => {
    swal({
      title: "Estas seguro de eliminar esta categoria?",
      text: "!Una vez borrada, no podrás recuperar esta categoria!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        e.preventDefault();
        const response = crud.DELETE(`/api/categorias/${idCategoria}`);
        //console.log(response.msg);
        const mensaje = response.msg;
        if (response) {
          swal("!Poof! !Su categoria ha sido borrada correctamente!", {
            icon: "success",
          });
        }
        cargarCategorias();
      } else {
        swal("!Tu categoria esta a salvo!");
      }
    });
  };

  const actualizarCategoria = async (idCategoria) => {
    navigate(`/actualizar-categoria/${idCategoria}`);
  };

  const crearProductos = async (idCategoria) => {
    navigate(`/home-productos/${idCategoria}`);
  };

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
                  categoria.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={item.imagen}
                          width="150"
                          height="150"
                          alt="Imagen de referencia"
                        ></img>
                      </td>
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
                          onClick={(e) => actualizarCategoria(item._id)}
                        />

                        <input
                          type="submit"
                          value="Crear producto"
                          className="bg-violet-600 mb-5 w-full py-3 px-4 text-white uppercase font-bold rounded hover:cursor-pointer"
                          onClick={(e) => crearProductos(item._id)}
                        />
                      </td>
                    </tr>
                  ))
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
