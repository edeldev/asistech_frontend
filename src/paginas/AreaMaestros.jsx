import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import io from "socket.io-client";
import "jspdf-autotable";
import "bootstrap-icons/font/bootstrap-icons.css";

let socket;

const AreaMaestros = () => {
  const { asistenciaMaestros, cargando2, submitAsistenciaMaestro } =
    useMaestroAsistencia();
  const params = useParams();

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("abrir asistencia", params.id);
  }, []);

  useEffect(() => {
    socket.on("asistencia agregada", (asistenciaNueva) => {
      submitAsistenciaMaestro(asistenciaNueva);
    });
  });

  if (cargando2) return "Cargando...";

  const asistenciasPorNombre = asistenciaMaestros.reduce((acc, asistencia) => {
    const nombre = asistencia.nombre;
    if (!acc[nombre]) {
      acc[nombre] = [];
    }
    acc[nombre].push(asistencia);
    return acc;
  }, {});

  return (
    <>
      {Object.keys(asistenciasPorNombre).length > 0 ? (
        <div className="d-flex justify-content-center align-items-center check-asistencias">
          <div className="save-asistencias text-center">
            <i className="bi bi-calendar2-check check-icon"></i>
            <p className="fw-light">
              Tus asistencias se han guardado correctamente para hoy{" "}
              <span className="fw-bold">
                {new Date().toLocaleDateString()}.
              </span>
            </p>
          </div>
        </div>
      ) : (
        <p>Aún no hay asistencias</p>
      )}
    </>
  );
};

export default AreaMaestros;
