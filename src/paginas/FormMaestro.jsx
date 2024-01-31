import { useState } from "react";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import Alerta from "../components/Alerta";

const FormMaestro = () => {
  const [matricula, setMatricula] = useState("");
  const [tipoHora, setTipoHora] = useState("");
  const [entrada, setEntrada] = useState("");

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

    await submitAsistencia({ matricula, tipoHora, entrada });
    setMatricula("");
    setTipoHora("");
    setEntrada("");
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
        <select
          className="select__asistencia"
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
          className="d-block mx-auto mb-3"
          onChange={(e) => setMatricula(e.target.value)}
        />
        <input type="submit" value="Enviar" />
      </form>
    </main>
  );
};

export default FormMaestro;
