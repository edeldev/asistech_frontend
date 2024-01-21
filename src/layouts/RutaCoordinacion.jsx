import { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import useCoordinacion from "../hooks/useCoordinacion"
import Dropdown from "../components/Dropdown"
import '../css/AreaCoordinacion.css'

const RutaCoordinacion = () => {

    const { authCoordinacion, cargando } = useCoordinacion()

    const [ toogleMenu, setToggleMenu ] = useState(false)

    const handleMenuClick = () => {
        setToggleMenu(!toogleMenu);
    };

    if( cargando ) return 'Cargando...'

  return (
    <>
        { authCoordinacion._id ?
        <>
            <header className='content'>
              <div className="coordinacion">
                <p className='logo fw-bold'>Bienvenido(a), {authCoordinacion.nombre.split(' ')[0]} {authCoordinacion.nombre.split(' ')[1]}!</p>

                <p>Área Coordinación</p>

                <div className='menu' onClick={handleMenuClick}>
                  <p>Menu</p>
                </div>

                { toogleMenu && <Dropdown tipoUsuario='coordinacion' /> }
              </div>
            </header>

            <main className="coordinacion__main">
              <Outlet />
            </main>
        </>
          : <Navigate to='/' replace={true} />
        }
    </>
  )
}

export default RutaCoordinacion