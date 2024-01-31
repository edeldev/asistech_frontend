import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAlumnos from "../hooks/useAlumnos";
import Dropdown from "../components/Dropdown";
import "../css/Maestros.css";

const RutaAlumnos = () => {
  const { authAlumnos, cargando } = useAlumnos();

  const [toogleMenu, setToggleMenu] = useState(false);

  const handleMenuClick = () => {
    setToggleMenu(!toogleMenu);
  };
  if (cargando) return "Cargando...";

  return (
    <>
      {authAlumnos._id ? (
        <>
          <header className="content">
            <div className="maestros">
              <p className="logo fw-bold">
                Bienvenido(a), {authAlumnos.nombre}!
              </p>

              <p>Área Alumnos</p>

              <div className="menu" onClick={handleMenuClick}>
                <p>Menu</p>
              </div>

              {toogleMenu && <Dropdown tipoUsuario="alumno" />}
            </div>
          </header>

          <main className="maestros__main">
            <Outlet />
          </main>
        </>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default RutaAlumnos;
