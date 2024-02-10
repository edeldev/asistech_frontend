import { useState } from "react";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import Alerta from "../components/Alerta";
import UMMLOGO from "../assets/umm_logo.png";

const FormMaestro = () => {
  const [matricula, setMatricula] = useState("");
  const [tipoHora, setTipoHora] = useState("");
  const [entrada, setEntrada] = useState("");
  const [tipoAsistencia, setTipoAsistencia] = useState("presencial");

  const { submitAsistencia, alerta, mostrarAlerta } = useMaestroAsistencia();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([matricula, tipoHora, entrada].includes("")) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    await submitAsistencia({ matricula, tipoHora, entrada, tipoAsistencia });
    setMatricula("");
    setTipoHora("");
    setEntrada("");
  };

  const handleToggleTipoAsistencia = () => {
    // Cambia entre "presencial" y "enLinea"
    setTipoAsistencia((prevTipoAsistencia) =>
      prevTipoAsistencia === "presencial" ? "enLinea" : "presencial"
    );
  };

  const renderOpcionesSalida = () => {
    switch (entrada) {
      case "entradaUno":
        return (
          <>
            <option value="horaUno">Primer Entrada</option>
            <option value="horaDos">Primer Salida</option>
          </>
        );
      case "entradaDos":
        return (
          <>
            <option value="horaTres">Segunda Entrada</option>
            <option value="horaCuatro">Segunda Salida</option>
          </>
        );
      case "entradaTres":
        return (
          <>
            <option value="horaCinco">Tercera Entrada</option>
            <option value="horaSeis">Tercera Salida</option>
          </>
        );
      case "entradaCuatro":
        return (
          <>
            <option value="horaSiete">Cuarta Entrada</option>
            <option value="horaOcho">Cuarta Salida</option>
          </>
        );
      case "entradaCinco":
        return (
          <>
            <option value="horaNueve">Quinta Entrada</option>
            <option value="horaDiez">Quinta Salida</option>
          </>
        );
      case "entradaSeis":
        return (
          <>
            <option value="horaOnce">Sexta Entrada</option>
            <option value="horaDoce">Sexta Salida</option>
          </>
        );
      default:
        return null;
    }
  };

  const { msg } = alerta;

  return (
    <main className="asistencia-maestro">
      <h2 className="text-white mb-3 text-center">
        Registra tu asistencia maestro(a)
      </h2>

      {msg && <Alerta alerta={alerta} />}

      <form onSubmit={handleSubmit} className="form-registro">
        <p className="text-center m-0 switch-presencial">
          Presencial / <span className="switch-linea">En Línea</span>
        </p>
        <div className="d-flex justify-content-center">
          <label className="switch">
            <input type="checkbox" onChange={handleToggleTipoAsistencia} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="d-flex justify-content-center align-items-center form-flex">
          <img src={UMMLOGO} alt="logo-umm" className="img-logo" />
          <div className="content-asistencia">
            <label className="text-start mb-2 text-white">
              Elige Entrada/Salida:
            </label>
            <select
              className="select__asistencia d-block mx-auto"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
            >
              <option value="">-- Seleccione una acción --</option>
              <option value="entradaUno">Primer Entrada / Salida</option>
              <option value="entradaDos">Segunda Entrada / Salida</option>
              <option value="entradaTres">Tercera Entrada / Salida</option>
              <option value="entradaCuatro">Cuarta Entrada / Salida</option>
              <option value="entradaCinco">Quinta Entrada / Salida</option>
              <option value="entradaSeis">Sexta Entrada / Salida</option>
            </select>
            <label className="text-start mb-2 text-white">
              Elige una acción:
            </label>
            <select
              className="select__asistencia d-block"
              value={tipoHora}
              onChange={(e) => setTipoHora(e.target.value)}
            >
              <option value="">-- Seleccione una acción --</option>
              {renderOpcionesSalida()}
            </select>
            <input
              type="text"
              value={matricula}
              placeholder="Escribe tu matricula"
              className="d-block mx-auto mb-3 w-100 mt-2"
              onChange={(e) => setMatricula(e.target.value)}
            />
            <div className="text-center">
              <input type="submit" value="Enviar" />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default FormMaestro;
