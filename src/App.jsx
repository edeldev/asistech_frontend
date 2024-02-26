import { BrowserRouter, Routes, Route } from "react-router-dom";

// LAYOUTS
import AuthLayout from "./layouts/AuthLayout";
import RutaCoordinacion from "./layouts/RutaCoordinacion";
import RutaMaestros from "./layouts/RutaMaestros";

// Context API
import { AuthCoordinacion } from "./context/AuthCoordinacion";
import { AuthMaestros } from "./context/AuthMaestros";
import { MaestroAsistenciaProvider } from "./context/MaestroAsistenciaProvider";

// Páginas
import AcercaDe from "./paginas/AcercaDe";
import AreaCoordinacion from "./paginas/AreaCoordinacion";
import FormMaestro from "./paginas/FormMaestro";
import Registrar from "./paginas/Registrar";
import Login from "./paginas/Login";
import AreaMaestros from "./paginas/AreaMaestros";

function App() {
  return (
    <BrowserRouter>
      <AuthCoordinacion>
        <AuthMaestros>
          <MaestroAsistenciaProvider>
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route index element={<Login tipoUsuario="maestro" />} />
                <Route
                  path="/login-coordinacion"
                  element={<Login tipoUsuario="coordinacion" />}
                />
                <Route
                  path="/coordinacion-registrar"
                  element={<Registrar tipoUsuario="coordinacion" />}
                />
                <Route
                  path="/maestro-registrar"
                  element={<Registrar tipoUsuario="maestro" />}
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

              <Route path="/area-maestros/:id" element={<RutaMaestros />}>
                <Route index element={<AreaMaestros tipoUsuario="maestro" />} />
              </Route>

              <Route path="/asistencia">
                <Route index element={<FormMaestro />} />
              </Route>
            </Routes>
          </MaestroAsistenciaProvider>
        </AuthMaestros>
      </AuthCoordinacion>
    </BrowserRouter>
  );
}

export default App;
