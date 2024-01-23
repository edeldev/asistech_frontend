import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Filtro from "../components/Filtro";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import io from "socket.io-client";

let socket;

const AreaCoordinacion = () => {
  const [seccionAbierta, setSeccionAbierta] = useState(null);
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

  const toggleSeccion = (nombre) => {
    setSeccionAbierta((prevSeccion) =>
      prevSeccion === nombre ? null : nombre
    );
  };

  const contarHoras = (asistencia) => {
    let horas = 0;

    // Comprobar solo las horas de entrada
    const horasEntrada = [
      asistencia.horaUno,
      asistencia.horaTres,
      asistencia.horaCinco,
      asistencia.horaSiete,
      asistencia.horaNueve,
      asistencia.horaOnce,
    ];

    // Contar las horas de entrada
    horasEntrada.forEach((entrada) => {
      if (entrada) {
        horas++;
      }
    });

    return horas;
  };

  return (
    <>
      {Object.keys(asistenciasPorNombre).length > 0 ? (
        <>
          <div className="asistencia-filtro d-flex justify-content-between align-items-center mt-3 mb-5">
            <button>Exportar excel</button>
            <Filtro />
          </div>
          <h2 className="fw-bold">Docentes</h2>
          {Object.keys(asistenciasPorNombre).map((nombre) => (
            <div key={nombre}>
              <h3
                className="text-center fw-bold semana mt-4"
                onClick={() => toggleSeccion(nombre)}
                style={{ cursor: "pointer" }}
              >
                {`${nombre}`}
              </h3>

              {seccionAbierta === nombre && (
                <>
                  <div className="tabla">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Primer Entrada</th>
                          <th>Primer Salida</th>
                          <th>Segunda Entrada</th>
                          <th>Segunda Salida</th>
                          <th>Tercer Entrada</th>
                          <th>Tercer Salida</th>
                          <th>Cuarta Entrada</th>
                          <th>Cuarta Salida</th>
                          <th>Quinta Entrada</th>
                          <th>Quinta Salida</th>
                          <th>Sexta Entrada</th>
                          <th>Sexta Salida</th>
                        </tr>
                      </thead>
                      <tbody>
                        {asistenciasPorNombre[nombre].map((asistencia) => (
                          <tr key={asistencia._id}>
                            <td>{`${
                              asistencia.dia.charAt(0).toUpperCase() +
                              asistencia.dia.slice(1)
                            } ${asistencia.fecha}`}</td>
                            <td>{asistencia.horaUno}</td>
                            <td>{asistencia.horaDos}</td>
                            <td>{asistencia.horaTres}</td>
                            <td>{asistencia.horaCuatro}</td>
                            <td>{asistencia.horaCinco}</td>
                            <td>{asistencia.horaSeis}</td>
                            <td>{asistencia.horaSiete}</td>
                            <td>{asistencia.horaOcho}</td>
                            <td>{asistencia.horaNueve}</td>
                            <td>{asistencia.horaDiez}</td>
                            <td>{asistencia.horaOnce}</td>
                            <td>{asistencia.horaDoce}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="fw-bold mt-3">
                    Cantidad total de hora
                    {asistenciasPorNombre[nombre].reduce(
                      (total, asistencia) => total + contarHoras(asistencia),
                      0
                    ) === 1
                      ? " "
                      : "s "}
                    para {nombre}:{" "}
                    {asistenciasPorNombre[nombre].reduce(
                      (total, asistencia) => total + contarHoras(asistencia),
                      0
                    )}{" "}
                    hora
                    {asistenciasPorNombre[nombre].reduce(
                      (total, asistencia) => total + contarHoras(asistencia),
                      0
                    ) === 1
                      ? ""
                      : "s"}
                  </p>
                </>
              )}
            </div>
          ))}
        </>
      ) : (
        <p>Aún no hay asistencias</p>
      )}
    </>
  );
};

export default AreaCoordinacion;
