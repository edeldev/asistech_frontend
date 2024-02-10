import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Filtro from "../components/Filtro";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import io from "socket.io-client";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ummLogo from "../assets/umm_logo.png";

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

  const generarReporte = (nombre) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = ummLogo;
    const imgWidth = 50;
    const imgHeight = 15;

    const centerX = doc.internal.pageSize.width / 2;

    const imgX = centerX - imgWidth / 2;
    const imgY = 20;

    doc.addImage(img, "JPEG", imgX, imgY, imgWidth, imgHeight);

    const lineaY = imgY + imgHeight + 5;
    const lineaInicioX = centerX - 50;
    const lineaFinX = centerX + 50;
    doc.setLineWidth(0.5);
    doc.line(lineaInicioX, lineaY, lineaFinX, lineaY);

    const texto = `Reporte de horas de asistencia para ${nombre}`;
    const textoWidth = doc.getTextWidth(texto);
    const textoX = centerX - textoWidth / 2;
    const textoY = lineaY + 10;
    doc.text(texto, textoX, textoY);

    // Agregar tabla
    const tableData = [
      [
        { content: "Nombre", styles: { textColor: "#FFFFFF" } },
        { content: "Horas", styles: { textColor: "#FFFFFF" } },
      ],
      [
        nombre,
        {
          content: contarHorasPorMaestro(nombre),
          styles: { textColor: "#000000" },
        },
      ],
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: textoY + 10,
      styles: {
        halign: "center",
        fillColor: "#FA5252",
      },
    });

    // Guardar el PDF
    doc.save(`${nombre}_reporte.pdf`);
  };

  const contarHorasPorMaestro = (nombre) => {
    return asistenciasPorNombre[nombre].reduce(
      (total, asistencia) => total + contarHoras(asistencia),
      0
    );
  };

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

  const exportarAExcel = () => {
    const data = [];
    Object.keys(asistenciasPorNombre).forEach((nombre) => {
      data.push([
        `${nombre} - Total Horas: ${asistenciasPorNombre[nombre].reduce(
          (total, asistencia) => total + contarHoras(asistencia),
          0
        )}`,
      ]);
      data.push([
        "Fecha",
        "Primer Entrada",
        "Primer Salida",
        "Segunda Entrada",
        "Segunda Salida",
        "Tercer Entrada",
        "Tercer Salida",
        "Cuarta Entrada",
        "Cuarta Salida",
        "Quinta Entrada",
        "Quinta Salida",
        "Sexta Entrada",
        "Sexta Salida",
      ]);
      asistenciasPorNombre[nombre].forEach((asistencia) => {
        data.push([
          `${
            asistencia.dia.charAt(0).toUpperCase() + asistencia.dia.slice(1)
          }, ${asistencia.fecha} ${
            asistencia.tipoAsistencia === "enLinea" ? "En Línea" : "Presencial"
          }`,
          asistencia.horaUno,
          asistencia.horaDos,
          asistencia.horaTres,
          asistencia.horaCuatro,
          asistencia.horaCinco,
          asistencia.horaSeis,
          asistencia.horaSiete,
          asistencia.horaOcho,
          asistencia.horaNueve,
          asistencia.horaDiez,
          asistencia.horaOnce,
          asistencia.horaDoce,
        ]);
      });
      data.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");

    // Guardar el archivo
    XLSX.writeFile(wb, "asistencias-maestros.xlsx");
  };

  return (
    <>
      {Object.keys(asistenciasPorNombre).length > 0 ? (
        <>
          <div className="asistencia-filtro d-flex justify-content-between align-items-center mt-3 mb-5">
            <button className="excel-button" onClick={exportarAExcel}>
              Exportar a Excel
            </button>
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
              <button
                onClick={() => generarReporte(nombre)}
                className="button-reporte"
              >
                Generar Reporte
              </button>

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
                            <td>
                              {`${
                                asistencia.dia.charAt(0).toUpperCase() +
                                asistencia.dia.slice(1)
                              } ${asistencia.fecha}`}{" "}
                              {
                                <span
                                  className={
                                    asistencia.tipoAsistencia === "enLinea"
                                      ? "linea"
                                      : "presencial"
                                  }
                                >
                                  {asistencia.tipoAsistencia === "enLinea"
                                    ? "En Línea"
                                    : "Presencial"}
                                </span>
                              }
                            </td>
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
