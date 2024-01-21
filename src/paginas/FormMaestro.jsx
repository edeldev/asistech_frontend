import { useState } from "react";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import Alerta from "../components/Alerta";

const FormMaestro = () => {
  const [matricula, setMatricula] = useState("");
  const [tipoHora, setTipoHora] = useState("");

  const { submitAsistencia, alerta, mostrarAlerta } = useMaestroAsistencia();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([matricula, tipoHora].includes("")) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    await submitAsistencia({ matricula, tipoHora });
    setMatricula("");
    setTipoHora("");
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
          className="select__asistencia"
          value={tipoHora}
          onChange={(e) => setTipoHora(e.target.value)}
        >
          <option value="">-- Seleccione una acción --</option>
          <option value="horaUno">Primer Entrada</option>
          <option value="horaDos">Primer Salida</option>
          <option value="horaTres">Segunda Entrada</option>
          <option value="horaCuatro">Segunda Salida</option>
          <option value="horaCinco">Tercera Entrada</option>
          <option value="horaSeis">Tercera Salida</option>
          <option value="horaSiete">Cuarta Entrada</option>
          <option value="horaOcho">Cuarta Salida</option>
          <option value="horaNueve">Quinta Entrada</option>
          <option value="horaDiez">Quinta Salida</option>
          <option value="horaOnce">Sexta Entrada</option>
          <option value="horaDoce">Sexta Salida</option>
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
