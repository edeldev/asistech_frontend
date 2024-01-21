import { useContext } from "react";
import MaestroAsistenciaContext from "../context/MaestroAsistenciaProvider";

const useMaestroAsistencia = () => {
    return useContext(MaestroAsistenciaContext)
}

export default useMaestroAsistencia