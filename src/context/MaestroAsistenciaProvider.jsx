import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import io from "socket.io-client";
import useCoordinacion from "../hooks/useCoordinacion";
import useMaestros from "../hooks/useMaestros";
let socket;

const MaestroAsistenciaContext = createContext();

const MaestroAsistenciaProvider = ({ children }) => {
  const [asistenciaMaestros, setAsistenciaMaestros] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [cargando2, setCargando2] = useState(true);
  const { authCoordinacion } = useCoordinacion();
  const { authMaestros } = useMaestros();

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerAsistencia = async () => {
      try {
        const { data } = await clienteAxios("/asistencia");
        setAsistenciaMaestros(data);
      } catch (error) {
        setAsistenciaMaestros([]);
        console.log(error);
      } finally {
        setCargando2(false);
      }
    };
    obtenerAsistencia();
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({});
    }, 3500);
  };

  const submitAsistencia = async (asistencia) => {
    try {
      const { data } = await clienteAxios.post("/asistencia", asistencia);
      mostrarAlerta({
        msg: "Asistencia tomada",
        error: false,
      });
      setTimeout(() => {
        navigate(`/area-maestros/${authMaestros._id}`);
      }, 3000);

      // Socket io
      socket.emit("nueva asistencia", data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        mostrarAlerta({
          msg: "La matrícula no existe",
          error: true,
        });
      } else if (error.response && error.response.status === 400) {
        mostrarAlerta({
          msg: error.response.data.msg,
          error: true,
        });
        return;
      }
    }
  };

  const eliminarTodasAsistencias = async () => {
    const clave = prompt("Ingresa la clave para eliminar las asistencias:");

    if (clave === "") {
      mostrarAlerta({
        msg: "Ingrese una clave",
        error: true,
      });
      return;
    }

    if (clave === "umm10") {
      const confirmarEliminacion = window.confirm(
        "¿Estás seguro de que quieres eliminar todas las asistencias? Esta acción es irreversible, continue con precaución"
      );

      if (confirmarEliminacion) {
        try {
          await clienteAxios.delete(
            `/usuarios/area-coordinacion/${authCoordinacion._id}`
          );
          setAsistenciaMaestros([]);
          mostrarAlerta({
            msg: "Todas las asistencias han sido eliminadas correctamente.",
            error: false,
          });
          setTimeout(() => {
            mostrarAlerta({});
          }, 3000);
        } catch (error) {
          console.log(error);
          mostrarAlerta({
            msg: "Error al eliminar todas las asistencias.",
            error: true,
          });
        }
      }
    } else {
      mostrarAlerta({
        msg: "Clave incorrecta. No se pudieron eliminar todas las asistencias.",
        error: true,
      });
    }
  };

  const cerrarSesion = () => {
    setAsistenciaMaestros([]);
    setAlerta({});
  };

  // Socket io
  const submitAsistenciaMaestro = (asistencia) => {
    setAsistenciaMaestros([...asistenciaMaestros, asistencia]);
  };

  return (
    <MaestroAsistenciaContext.Provider
      value={{
        asistenciaMaestros,
        submitAsistencia,
        alerta,
        cargando2,
        mostrarAlerta,
        submitAsistenciaMaestro,
        cerrarSesion,
        eliminarTodasAsistencias,
      }}
    >
      {children}
    </MaestroAsistenciaContext.Provider>
  );
};

export { MaestroAsistenciaProvider };

export default MaestroAsistenciaContext;
