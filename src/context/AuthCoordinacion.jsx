import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";

const AuthContextCoordinacion = createContext();

const AuthCoordinacion = ({ children }) => {
  const [authCoordinacion, setAuthCoordinacion] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token-coordinacion");

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
        const { data } = await clienteAxios(
          "/usuarios/perfil-coordinacion",
          config
        );
        setAuthCoordinacion(data);
      } catch (error) {
        setAuthCoordinacion({});
      }

      setCargando(false);
    };

    autenticarUsuario();
  }, []);

  return (
    <AuthContextCoordinacion.Provider
      value={{
        authCoordinacion,
        setAuthCoordinacion,
        cargando,
        setCargando,
      }}
    >
      {children}
    </AuthContextCoordinacion.Provider>
  );
};

export { AuthCoordinacion };

export default AuthContextCoordinacion;
