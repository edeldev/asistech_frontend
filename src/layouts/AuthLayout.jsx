import { Link, Outlet, useLocation } from 'react-router-dom'

const AuthLayout = () => {

  const location = useLocation()
  const { pathname } = location

  return (
    <>
        <header className='header shadow'>
          <div className="navigation">
            <Link to='/' className='home'>AsisTech</Link>
            <Link to='/acerca-de' className={`${ pathname === '/acerca-de' ? 'active' : ''} acerca`}>Acerca De</Link>
          </div>
        </header>
        
        <Outlet />
        
    </>
  )
}

export default AuthLayout
