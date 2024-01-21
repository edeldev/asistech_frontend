import { useContext } from "react";
import AuthContextAlumnos from "../context/AuthAlumnos";

const useAlumnos = () => {
  return useContext(AuthContextAlumnos);
};

export default useAlumnos;
