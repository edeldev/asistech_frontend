import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import useCoordinacion from "../hooks/useCoordinacion";

const LoginCoordinacion = () => {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const { setAuthCoordinacion } = useCoordinacion();

  const navigate = useNavigate();

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
      const { data } = await clienteAxios.post("/usuarios/login-coordinacion", {
        matricula,
        password,
      });
      setAlerta({});
      localStorage.setItem("token-coordinacion", data.token);
      setAuthCoordinacion(data);
      navigate(`/area-coordinacion/${data._id}`);
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
    <main className="main__coordinacion">
      <div className="contenedor__coordinacion d-flex justify-content-center p-5">
        <form onSubmit={handleSubmit} className="">
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

          <Link
            to="/coordinacion-registrar"
            className="text-decoration-none text-black"
          >
            Registrarse
          </Link>
        </form>
      </div>
    </main>
  );
};

export default LoginCoordinacion;
