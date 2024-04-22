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
      case "entradaUno8":
        return (
          <>
            <option value="horaUno8_00am">8:00am</option>
            <option value="horaDos8_50">8:50am</option>
          </>
        );
      case "entradaDos8_50":
        return (
          <>
            <option value="horaUno8_50">8:50am</option>
            <option value="horaDos9_40">9:40am</option>
          </>
        );
      case "entradaTres9_40":
        return (
          <>
            <option value="horaUno9_40">9:40am</option>
            <option value="horaDos10_30">10:30am</option>
          </>
        );
      case "entradaCuatro11_00":
        return (
          <>
            <option value="horaUno11_00">11:00am</option>
            <option value="horaDos11_50">11:50am</option>
          </>
        );
      case "entradaCinco11_50":
        return (
          <>
            <option value="horaUno11_50">11:50am</option>
            <option value="horaDos12_40">12:40pm</option>
          </>
        );
      case "entradaSeis12_40":
        return (
          <>
            <option value="horaUno12_40">12:40pm</option>
            <option value="horaDos13_30">13:30pm</option>
          </>
        );
      case "entradaUno6":
        return (
          <>
            <option value="horaUno6_00">6:00pm</option>
            <option value="horaDos6_40">6:40pm</option>
          </>
        );
      case "entradaDos6_40":
        return (
          <>
            <option value="horaUno6_40">6:40pm</option>
            <option value="horaDos7_20">7:20pm</option>
          </>
        );
      case "entradaTres7_20":
        return (
          <>
            <option value="horaUno7_20">7:20pm</option>
            <option value="horaDos8_00">8:00pm</option>
          </>
        );
      case "entradaCuatro8_00":
        return (
          <>
            <option value="horaUno8_00pm">8:00pm</option>
            <option value="horaDos8_40">8:40pm</option>
          </>
        );
      case "entradaCinco8_40":
        return (
          <>
            <option value="horaUno8_40">8:40pm</option>
            <option value="horaDos9_20">9:20pm</option>
          </>
        );
      case "entradaSeis9_20":
        return (
          <>
            <option value="horaUno9_20">9:20pm</option>
            <option value="horaDos10_00">10:00pm</option>
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
        <div className="pre-line">
          <p className="text-center m-0 switch-presencial">
            Presencial / <span className="switch-linea">En Línea</span>
          </p>
        </div>
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
              <option value="entradaUno8">8:00am / 8:50am</option>
              <option value="entradaDos8_50">8:50am / 9:40am</option>
              <option value="entradaTres9_40">9:40am / 10:30am</option>
              <option value="entradaCuatro11_00">11:00am / 11:50am</option>
              <option value="entradaCinco11_50">11:50am / 12:40pm</option>
              <option value="entradaSeis12_40">12:40pm / 13:30pm</option>
              <option value="entradaUno6">6:00pm / 6:40pm</option>
              <option value="entradaDos6_40">6:40pm / 7:20pm</option>
              <option value="entradaTres7_20">7:20pm / 8:00pm</option>
              <option value="entradaCuatro8_00">8:00pm / 8:40pm</option>
              <option value="entradaCinco8_40">8:40pm / 9:20pm</option>
              <option value="entradaSeis9_20">9:20pm / 10:00pm</option>
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
