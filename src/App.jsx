import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// LAYOUTS
import AuthLayout from "./layouts/AuthLayout";
import RutaCoordinacion from "./layouts/RutaCoordinacion";
import RutaMaestros from "./layouts/RutaMaestros";
import RutaAlumnos from "./layouts/RutaAlumnos";

// Context API
import { AuthCoordinacion } from "./context/AuthCoordinacion";
import { AuthMaestros } from "./context/AuthMaestros";
import { AuthAlumnos } from "./context/AuthAlumnos";
import { MaestroAsistenciaProvider } from "./context/MaestroAsistenciaProvider";

// Páginas
import AcercaDe from "./paginas/AcercaDe";
import AreaCoordinacion from "./paginas/AreaCoordinacion";
import LoginCoordinacion from "./paginas/LoginCoordinacion";
import RegistrarCoordinacion from "./paginas/RegistrarCoordinacion";
import FormMaestro from "./paginas/FormMaestro";
import Registrar from "./paginas/Registrar";
import Login from "./paginas/Login";
import AreaMaestros from "./paginas/AreaMaestros";
import AreaAlumnos from "./paginas/AreaAlumnos";

function App() {
  const [tipoUsuario, setTipoUsuario] = useState("");

  return (
    <BrowserRouter>
      <AuthCoordinacion>
        <AuthMaestros>
          <AuthAlumnos>
            <MaestroAsistenciaProvider>
              <Routes>
                <Route path="/" element={<AuthLayout />}>
                  <Route index element={<Login tipoUsuario="maestro" />} />
                  <Route
                    path="/login-alumno"
                    element={<Login tipoUsuario="alumno" />}
                  />
                  <Route
                    path="/login-coordinacion"
                    element={<LoginCoordinacion />}
                  />
                  <Route
                    path="/coordinacion-registrar"
                    element={<RegistrarCoordinacion />}
                  />
                  <Route
                    path="/maestro-registrar"
                    element={<Registrar tipoUsuario="maestro" />}
                  />

                  <Route
                    path="/alumno-registrar"
                    element={<Registrar tipoUsuario="alumno" />}
                  />
                  <Route path="/acerca-de" element={<AcercaDe />} />
                </Route>

                <Route
                  path="/area-coordinacion/:id"
                  element={<RutaCoordinacion />}
                >
                  <Route
                    index
                    element={<AreaCoordinacion tipoUsuario="coordinacion" />}
                  />
                </Route>

                <Route path="/area-maestros" element={<RutaMaestros />}>
                  <Route
                    index
                    element={<AreaMaestros tipoUsuario="maestro" />}
                  />
                </Route>

                <Route path="/area-alumnos" element={<RutaAlumnos />}>
                  <Route index element={<AreaAlumnos tipoUsuario="alumno" />} />
                </Route>

                <Route path="/asistencia">
                  <Route index element={<FormMaestro />} />
                </Route>
              </Routes>
            </MaestroAsistenciaProvider>
          </AuthAlumnos>
        </AuthMaestros>
      </AuthCoordinacion>
    </BrowserRouter>
  );
}

export default App;
