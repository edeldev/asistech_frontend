import { useContext } from "react";
import AuthContextCoordinacion from "../context/AuthCoordinacion";

const useCoordinacion = () => {
    return useContext(AuthContextCoordinacion)
}

export default useCoordinacion