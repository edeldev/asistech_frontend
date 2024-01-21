import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";

const AuthContextAlumnos = createContext();

const AuthAlumnos = ({ children }) => {
  const [authAlumnos, setAuthAlumnos] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token-alumno");

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
        const { data } = await clienteAxios("/usuarios/perfil-alumno", config);
        setAuthAlumnos(data);
      } catch (error) {
        setAuthAlumnos({});
      }

      setCargando(false);
    };

    autenticarUsuario();
  }, []);

  return (
    <AuthContextAlumnos.Provider
      value={{
        authAlumnos,
        setAuthAlumnos,
        cargando,
        setCargando,
      }}
    >
      {children}
    </AuthContextAlumnos.Provider>
  );
};

export { AuthAlumnos };

export default AuthContextAlumnos;
