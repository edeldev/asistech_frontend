import { useNavigate } from "react-router-dom";
import useMaestroAsistencia from "../hooks/useMaestroAsistencia";
import useMaestros from "../hooks/useMaestros";

const Dropdown = ({ tipoUsuario, setToggleMenu }) => {
  const navigate = useNavigate();
  const { cerrarSesion } = useMaestroAsistencia();
  const { cerrarSesionMaestro } = useMaestros();

  const handleLogoutCoordinacion = () => {
    localStorage.removeItem("token-coordinacion");
    navigate("/");
  };

  const handleLogoutMaestro = () => {
    localStorage.removeItem("token-maestro");
    cerrarSesion();
    cerrarSesionMaestro();
    navigate("/");
  };

  const handleLogoutAlumno = () => {
    localStorage.removeItem("token-alumno");
    navigate("/");
  };

  return (
    <div className="dropdown">
      <ul>
        {tipoUsuario === "maestro" ? (
          <>
            <li onClick={handleLogoutMaestro}>Cerrar Sesión</li>
          </>
        ) : tipoUsuario === "coordinacion" ? (
          <>
            <li>Asistencia Maestros</li>
            <li onClick={() => navigate("/alumno-registrar")}>
              Registrar a un alumno
            </li>
            <li onClick={() => navigate("/maestro-registrar")}>
              Registrar a un Maestro
            </li>
            <li onClick={handleLogoutCoordinacion}>Cerrar Sesión</li>
          </>
        ) : (
          <li onClick={handleLogoutAlumno}>Cerrar Sesión</li>
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
