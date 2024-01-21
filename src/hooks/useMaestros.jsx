import { useContext } from "react";
import AuthContextMaestros from "../context/AuthMaestros";

const useMaestros = () => {
    return useContext(AuthContextMaestros)
}

export default useMaestros