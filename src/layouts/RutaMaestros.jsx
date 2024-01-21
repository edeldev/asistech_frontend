import { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import useMaestros from "../hooks/useMaestros"
import Dropdown from "../components/Dropdown"
import '../css/Maestros.css'

const RutaMaestros = () => {

    const { authMaestros, cargando } = useMaestros()

    const [ toogleMenu, setToggleMenu ] = useState(false)

    const handleMenuClick = () => {
        setToggleMenu(!toogleMenu);
    };
    if( cargando ) return 'Cargando...'

  return (
    <>
        { authMaestros._id ?
        <>
            <header className='content'>
              <div className="maestros">
                <p className='logo fw-bold'>Bienvenido(a), {authMaestros.nombre.split(' ')[0]} {authMaestros.nombre.split(' ')[1]}!</p>

                <p>Área Maestros</p>

                <div className='menu' onClick={handleMenuClick}>
                  <p>Menu</p>
                </div>

                { toogleMenu && <Dropdown tipoUsuario='maestro' /> }
              </div>
            </header>

            <main className="maestros__main">
              <Outlet />
            </main>
        </>
          : <Navigate to='/' replace={true} />
        }
    </>
  )
}

export default RutaMaestros