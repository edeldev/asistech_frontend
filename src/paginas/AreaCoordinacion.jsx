import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import io from "socket.io-client";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ummLogo from "../assets/umm_logo.png";
import Filtro from "../components/Filtro";
import Alerta from "../components/Alerta";
import { CapitalizeNames, Capitalize } from "../helpers/CapitalizeNames";

let socket;

const AreaCoordinacion = () => {
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [asistenciasFiltrados, setAsistenciasFiltrados] = useState([]);
  const [matriculaMaestro, setMatricula] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const {
    asistenciaMaestros,
    cargando2,
    submitAsistenciaMaestro,
    eliminarTodasAsistencias,
    alerta,
  } = useMaestroAsistencia();
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

  useEffect(() => {
    // Verificar si asistenciaMaestros es un array no vacío
    if (Array.isArray(asistenciaMaestros) && asistenciaMaestros.length > 0) {
      const filtroAsistencias = asistenciaMaestros.filter(
        (asistencia) =>
          asistencia.matricula === matriculaMaestro ||
          asistencia.dia === dia ||
          asistencia.mes === mes
      );
      setAsistenciasFiltrados(filtroAsistencias);
    } else {
      setAsistenciasFiltrados([]);
    }
  }, [asistenciaMaestros, matriculaMaestro, dia, mes]);

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

  const asistenciasPorNombreFiltro = asistenciasFiltrados.reduce(
    (acc, asistencia) => {
      const nombre = asistencia.nombre;
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push(asistencia);
      return acc;
    },
    {}
  );

  const toggleSeccion = (nombre) => {
    setSeccionAbierta((prevSeccion) =>
      prevSeccion === nombre ? null : nombre
    );
  };

  const contarHoras = (asistencia) => {
    let horas = 0;

    // Comprobar solo las horas de entrada
    const horasEntrada = [
      asistencia.horaUno8_00am,
      asistencia.horaDos8_50,
      asistencia.horaUno8_50,
      asistencia.horaDos9_40,
      asistencia.horaUno9_40,
      asistencia.horaDos10_30,
      asistencia.horaUno11_00,
      asistencia.horaDos11_50,
      asistencia.horaUno11_50,
      asistencia.horaDos12_40,
      asistencia.horaUno12_40,
      asistencia.horaDos13_30,
      asistencia.horaUno6_00,
      asistencia.horaDos6_40,
      asistencia.horaUno6_40,
      asistencia.horaDos7_20,
      asistencia.horaUno7_20,
      asistencia.horaDos8_00,
      asistencia.horaUno8_00pm,
      asistencia.horaDos8_40,
      asistencia.horaUno8_40,
      asistencia.horaDos9_20,
      asistencia.horaUno9_20,
      asistencia.horaDos10_00,
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
        "Primer Entrada: 8:00am",
        "Primer Salida: 8:50am",
        "Segunda Entrada: 8:50am",
        "Segunda Salida: 9:40am",
        "Tercer Entrada: 9:40am",
        "Tercer Salida: 10:30am",
        "Cuarta Entrada: 11:00am",
        "Cuarta Salida: 11:50am",
        "Quinta Entrada: 11:50am",
        "Quinta Salida: 12:40pm",
        "Sexta Entrada: 12:40pm",
        "Sexta Salida: 13:30pm",
        "Primer Entrada: 6:00pm",
        "Primer Salida: 6:40pm",
        "Segunda Entrada: 6:40pm",
        "Segunda Salida: 7:20pm",
        "Tercer Entrada: 7:20pm",
        "Tercer Salida: 8:00pm",
        "Cuarta Entrada: 8:00pm",
        "Cuarta Salida: 8:40pm",
        "Quinta Entrada: 8:40pm",
        "Quinta Salida: 9:20pm",
        "Sexta Entrada: 9:20pm",
        "Sexta Salida: 10:00pm",
      ]);
      asistenciasPorNombre[nombre].forEach((asistencia) => {
        data.push([
          `${
            asistencia.dia.charAt(0).toUpperCase() + asistencia.dia.slice(1)
          }, ${asistencia.fecha} ${
            asistencia.tipoAsistencia === "enLinea" ? "En Línea" : "Presencial"
          }`,
          asistencia.horaUno8_00am,
          asistencia.horaDos8_50,
          asistencia.horaUno8_50,
          asistencia.horaDos9_40,
          asistencia.horaUno9_40,
          asistencia.horaDos10_30,
          asistencia.horaUno11_00,
          asistencia.horaDos11_50,
          asistencia.horaUno11_50,
          asistencia.horaDos12_40,
          asistencia.horaUno12_40,
          asistencia.horaDos13_30,
          asistencia.horaUno6_00,
          asistencia.horaDos6_40,
          asistencia.horaUno6_40,
          asistencia.horaDos7_20,
          asistencia.horaUno7_20,
          asistencia.horaDos8_00,
          asistencia.horaUno8_00pm,
          asistencia.horaDos8_40,
          asistencia.horaUno8_40,
          asistencia.horaDos9_20,
          asistencia.horaUno9_20,
          asistencia.horaDos10_00,
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

  const handleClear = (e) => {
    e.preventDefault();
    setMatricula("");
    setDia("");
    setMes("");
  };

  const { msg } = alerta;

  return (
    <>
      {msg && <Alerta alerta={alerta} />}

      {Object.keys(asistenciasPorNombre).length > 0 ? (
        <>
          <div className="asistencia-filtro d-flex justify-content-between align-items-center mt-3 mb-5">
            <button className="excel-button mb-3" onClick={exportarAExcel}>
              Exportar a Excel{" "}
              <i className="bi bi-file-earmark-spreadsheet"></i>
            </button>
            <button
              className="eliminar-asistencia"
              onClick={() => eliminarTodasAsistencias()}
            >
              Eliminar Asistencias <i className="bi bi-trash3"></i>
            </button>
          </div>
          <div className="d-flex justify-content-center mb-4">
            <Filtro
              matriculaMaestro={matriculaMaestro}
              setMatricula={setMatricula}
              dia={dia}
              setDia={setDia}
              mes={mes}
              setMes={setMes}
              handleClear={handleClear}
            />
          </div>

          {asistenciasFiltrados.length > 0 ? (
            <>
              <h2 className="fw-bold">Docentes filtrados</h2>
              {Object.keys(asistenciasPorNombreFiltro).map((nombre) => (
                <div key={nombre}>
                  <h3
                    className="text-center fw-bold semana mt-4"
                    onClick={() => toggleSeccion(nombre)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${CapitalizeNames(nombre)}`}
                  </h3>
                  <button
                    onClick={() => generarReporte(nombre)}
                    className="button-reporte"
                  >
                    Generar Reporte <i className="bi bi-file-earmark-pdf"></i>
                  </button>
                  {seccionAbierta === nombre && (
                    <>
                      <div className="tabla">
                        <table>
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Entrada: 8:00am</th>
                              <th>Salida: 8:50am</th>
                              <th>Entrada: 8:50am</th>
                              <th>Salida: 9:40am</th>
                              <th>Entrada: 9:40am</th>
                              <th>Salida: 10:30am</th>
                              <th>Entrada: 11:00am</th>
                              <th>Salida: 11:50am</th>
                              <th>Entrada: 11:50am</th>
                              <th>Salida: 12:40pm</th>
                              <th>Entrada: 12:40pm</th>
                              <th>Salida: 13:30pm</th>
                              <th>Entrada: 6:00pm</th>
                              <th>Salida: 6:40pm</th>
                              <th>Entrada: 6:40pm</th>
                              <th>Salida: 7:20pm</th>
                              <th>Entrada: 7:20pm</th>
                              <th>Salida: 8:00pm</th>
                              <th>Entrada: 8:00pm</th>
                              <th>Salida: 8:40pm</th>
                              <th>Entrada: 8:40pm</th>
                              <th>Salida: 9:20pm</th>
                              <th>Entrada: 9:20pm</th>
                              <th>Salida: 10:00pm</th>
                            </tr>
                          </thead>
                          <tbody>
                            {asistenciasPorNombreFiltro[nombre].map(
                              (asistencia) => (
                                <tr key={asistencia._id}>
                                  <td>
                                    {`${Capitalize(asistencia.dia)} ${
                                      asistencia.fecha
                                    }`}{" "}
                                    <br />
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
                                  </td>
                                  <td>{asistencia.horaUno8_00am}</td>
                                  <td>{asistencia.horaDos8_50}</td>
                                  <td>{asistencia.horaUno8_50}</td>
                                  <td>{asistencia.horaDos9_40}</td>
                                  <td>{asistencia.horaUno9_40}</td>
                                  <td>{asistencia.horaDos10_30}</td>
                                  <td>{asistencia.horaUno11_00}</td>
                                  <td>{asistencia.horaDos11_50}</td>
                                  <td>{asistencia.horaUno11_50}</td>
                                  <td>{asistencia.horaDos12_40}</td>
                                  <td>{asistencia.horaUno12_40}</td>
                                  <td>{asistencia.horaDos13_30}</td>
                                  <td>{asistencia.horaUno6_00}</td>
                                  <td>{asistencia.horaDos6_40}</td>
                                  <td>{asistencia.horaUno6_40}</td>
                                  <td>{asistencia.horaDos7_20}</td>
                                  <td>{asistencia.horaUno7_20}</td>
                                  <td>{asistencia.horaDos8_00}</td>
                                  <td>{asistencia.horaUno8_00pm}</td>
                                  <td>{asistencia.horaDos8_40}</td>
                                  <td>{asistencia.horaUno8_40}</td>
                                  <td>{asistencia.horaDos9_20}</td>
                                  <td>{asistencia.horaUno9_20}</td>
                                  <td>{asistencia.horaDos10_00}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      <p className="fw-bold mt-3">
                        Cantidad total de hora
                        {asistenciasPorNombre[nombre].reduce(
                          (total, asistencia) =>
                            total + contarHoras(asistencia),
                          0
                        ) === 1
                          ? " "
                          : "s "}
                        para {CapitalizeNames(nombre)}:{" "}
                        {asistenciasPorNombre[nombre].reduce(
                          (total, asistencia) =>
                            total + contarHoras(asistencia),
                          0
                        )}{" "}
                        hora
                        {asistenciasPorNombre[nombre].reduce(
                          (total, asistencia) =>
                            total + contarHoras(asistencia),
                          0
                        ) === 1
                          ? ""
                          : "s"}
                      </p>
                    </>
                  )}
                </div>
              ))}
              <p>
                Número de asistencias filtradas: {asistenciasFiltrados.length}
              </p>
            </>
          ) : (
            <>
              <h2 className="fw-bold">Docentes</h2>
              {Object.keys(asistenciasPorNombre).map((nombre) => (
                <div key={nombre}>
                  <h3
                    className="text-center fw-bold semana mt-4"
                    onClick={() => toggleSeccion(nombre)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${CapitalizeNames(nombre)}`}
                  </h3>
                  <button
                    onClick={() => generarReporte(nombre)}
                    className="button-reporte"
                  >
                    Generar Reporte <i className="bi bi-file-earmark-pdf"></i>
                  </button>
                  {seccionAbierta === nombre && (
                    <>
                      <div className="tabla">
                        <table>
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Entrada: 8:00am</th>
                              <th>Salida: 8:50am</th>
                              <th>Entrada: 8:50am</th>
                              <th>Salida: 9:40am</th>
                              <th>Entrada: 9:40am</th>
                              <th>Salida: 10:30am</th>
                              <th>Entrada: 11:00am</th>
                              <th>Salida: 11:50am</th>
                              <th>Entrada: 11:50am</th>
                              <th>Salida: 12:40pm</th>
                              <th>Entrada: 12:40pm</th>
                              <th>Salida: 13:30pm</th>
                              <th>Entrada: 6:00pm</th>
                              <th>Salida: 6:40pm</th>
                              <th>Entrada: 6:40pm</th>
                              <th>Salida: 7:20pm</th>
                              <th>Entrada: 7:20pm</th>
                              <th>Salida: 8:00pm</th>
                              <th>Entrada: 8:00pm</th>
                              <th>Salida: 8:40pm</th>
                              <th>Entrada: 8:40pm</th>
                              <th>Salida: 9:20pm</th>
                              <th>Entrada: 9:20pm</th>
                              <th>Salida: 10:00pm</th>
                            </tr>
                          </thead>
                          <tbody>
                            {asistenciasPorNombre[nombre].map((asistencia) => (
                              <tr key={asistencia._id}>
                                <td>
                                  {`${Capitalize(asistencia.dia)} ${
                                    asistencia.fecha
                                  }`}
                                  <br />
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
                                </td>
                                <td>{asistencia.horaUno8_00am}</td>
                                <td>{asistencia.horaDos8_50}</td>
                                <td>{asistencia.horaUno8_50}</td>
                                <td>{asistencia.horaDos9_40}</td>
                                <td>{asistencia.horaUno9_40}</td>
                                <td>{asistencia.horaDos10_30}</td>
                                <td>{asistencia.horaUno11_00}</td>
                                <td>{asistencia.horaDos11_50}</td>
                                <td>{asistencia.horaUno11_50}</td>
                                <td>{asistencia.horaDos12_40}</td>
                                <td>{asistencia.horaUno12_40}</td>
                                <td>{asistencia.horaDos13_30}</td>
                                <td>{asistencia.horaUno6_00}</td>
                                <td>{asistencia.horaDos6_40}</td>
                                <td>{asistencia.horaUno6_40}</td>
                                <td>{asistencia.horaDos7_20}</td>
                                <td>{asistencia.horaUno7_20}</td>
                                <td>{asistencia.horaDos8_00}</td>
                                <td>{asistencia.horaUno8_00pm}</td>
                                <td>{asistencia.horaDos8_40}</td>
                                <td>{asistencia.horaUno8_40}</td>
                                <td>{asistencia.horaDos9_20}</td>
                                <td>{asistencia.horaUno9_20}</td>
                                <td>{asistencia.horaDos10_00}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="fw-bold mt-3">
                        Cantidad total de hora
                        {asistenciasPorNombre[nombre].reduce(
                          (total, asistencia) =>
                            total + contarHoras(asistencia),
                          0
                        ) === 1
                          ? " "
                          : "s "}
                        para {CapitalizeNames(nombre)}:{" "}
                        {asistenciasPorNombre[nombre].reduce(
                          (total, asistencia) =>
                            total + contarHoras(asistencia),
                          0
                        )}{" "}
                        hora
                        {asistenciasPorNombre[nombre].reduce(
                          (total, asistencia) =>
                            total + contarHoras(asistencia),
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
          )}
        </>
      ) : (
        <p>Aún no hay asistencias</p>
      )}
    </>
  );
};

export default AreaCoordinacion;
