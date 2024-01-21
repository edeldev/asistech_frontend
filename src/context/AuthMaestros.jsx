import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";

const AuthContextMaestros = createContext();

const AuthMaestros = ({ children }) => {
  const [authMaestros, setAuthMaestros] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token-maestro");

      if (!token) {
        setCargando(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await clienteAxios("/usuarios/perfil-maestro", config);
        setAuthMaestros(data);
      } catch (error) {
        setAuthMaestros({});
      }

      setCargando(false);
    };

    autenticarUsuario();
  }, []);

  const cerrarSesionMaestro = () => {
    setAuthMaestros({});
  };

  return (
    <AuthContextMaestros.Provider
      value={{
        authMaestros,
        setAuthMaestros,
        cargando,
        setCargando,
        cerrarSesionMaestro,
      }}
    >
      {children}
    </AuthContextMaestros.Provider>
  );
};

export { AuthMaestros };

export default AuthContextMaestros;
