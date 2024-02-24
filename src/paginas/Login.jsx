import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import useMaestros from "../hooks/useMaestros";
import useCoordinacion from "../hooks/useCoordinacion";

const Login = ({ tipoUsuario }) => {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const { setAuthMaestros } = useMaestros();
  const { setAuthCoordinacion } = useCoordinacion();

  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar la alerta cuando tipoUsuario cambia y formulario
    setAlerta({});
    setMatricula("");
    setPassword("");
  }, [tipoUsuario]);

  /**
   * This function handles form submission in a React component, validating the form fields and making
   * a POST request to a server endpoint based on the selected user type.
   * @returns The function does not explicitly return anything.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([matricula, password].includes("")) {
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    try {
      const { data } = await clienteAxios.post(
        tipoUsuario === "maestro"
          ? "/usuarios/login-maestro"
          : "/usuarios/login-coordinacion",
        { matricula, password }
      );
      setAlerta({});
      if (tipoUsuario === "maestro") {
        localStorage.setItem("token-maestro", data.token);
      } else {
        localStorage.setItem("token-coordinacion", data.token);
      }
      tipoUsuario === "maestro"
        ? setAuthMaestros(data)
        : setAuthCoordinacion(data);
      navigate(
        tipoUsuario === "maestro"
          ? `/area-maestros`
          : `/area-coordinacion/${data._id}`
      );
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
    setMatricula("");
    setPassword("");
  };

  const { msg } = alerta;

  return (
    <main className="main__header">
      <div className="contenedor d-flex">
        <form
          onSubmit={handleSubmit}
          className={`
                ${tipoUsuario === "maestro" ? "order-2" : "order-1"} 
                ${tipoUsuario === "maestro" ? "activo" : ""} 
                col-6 
                forms__container
              `}
        >
          {msg && <Alerta alerta={alerta} />}

          <h2 className="text-center pb-3 fw-light">Iniciar Sesión</h2>

          <label className="d-block pb-2 fw-bold" htmlFor="matricula">
            Matrícula
          </label>
          <input
            type="text"
            id="matricula"
            className="input"
            placeholder="Matrícula de registro"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />

          <label className="d-block pt-3 pb-2 fw-bold" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="input"
            placeholder="Password de registro"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" value="Iniciar Sesión" className="submit my-3" />
        </form>

        <div
          className={`
                ${tipoUsuario === "maestro" ? "order-1" : "order-2"}
                ${tipoUsuario === "maestro" ? "activo" : ""}
                container__saludo 
                col-6 d-flex
                flex-column
                justify-content-center
                text-center
                `}
        >
          <h2 className="fw-bold text-white m-0">Hola!</h2>
          <p className="my-4 fw-light text-white">
            ¡Ahora la asistencia es más rápido y fácil!
          </p>
          <Link to={tipoUsuario === "maestro" ? "/login-coordinacion" : "/"}>
            {tipoUsuario === "maestro" ? "Área Coordinacion" : "Área Maestros"}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
