import { useState } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const RegistrarCoordinacion = () => {

  const [ nombre, setNombre ] = useState('')
  const [ matricula, setMatricula ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ repetirPassword, setRepetirPassword ] = useState('')

  const [ alerta, setAlerta ] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    if([nombre, matricula, password, repetirPassword].includes('')) {
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return
    } 

    if(password !== repetirPassword) {
      setAlerta({
        msg: "Los passwords no son iguales",
        error: true
      })
      return
    }

    if(password.length < 6) {
      setAlerta({
        msg: "El password es muy corto, agrega minimo 6 caracteres",
        error: true
      })
      return
    }

    setAlerta({})

    // Crear el usuario en la API
    try {
      const { data } = await clienteAxios.post('/usuarios/coordinacion-registrar', { nombre, matricula, password })
      setAlerta({
        msg: data.msg,
        error: false
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      setNombre('')
      setMatricula('')
      setPassword('')
      setRepetirPassword('')

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alerta

  return (
    <div className="forms__registrar">
        <div className='contenido no-activo'>
          <h2 className='text-center mt-3'>Registrarse</h2>

          { msg && <Alerta alerta={alerta} /> }

          <form className='w-50 mx-auto' onSubmit={handleSubmit}>
            <label className="d-block pb-2 fw-bold mt-3" htmlFor="nombre">Nombre</label>
              <input 
                type="text"
                id="nombre" 
                className='input'
                placeholder="Nombre de registro"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />

              <label className="d-block pb-2 fw-bold mt-3" htmlFor="matricula">Matrícula</label>
              <input 
                type="text"
                id="matricula" 
                className='input'
                placeholder="Matrícula de registro"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
              />

              <label className="d-block pb-2 fw-bold mt-3" htmlFor="password">Password</label>
              <input 
                type="password"
                id="password" 
                className='input'
                placeholder="Password de registro"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <label className="d-block pb-2 fw-bold mt-3" htmlFor="password2">Repetir Password</label>
              <input 
                type="password"
                id="password2" 
                className='input'
                placeholder="Repetir Password de registro"
                value={repetirPassword}
                onChange={e => setRepetirPassword(e.target.value)}
              />

              <input 
                type="submit"
                className='submit my-3'  
              />

                <Link to='/login-coordinacion' className='text-decoration-none text-black'>Iniciar Sesión</Link>
          </form>
        </div>
      </div>
  )
}

export default RegistrarCoordinacion
