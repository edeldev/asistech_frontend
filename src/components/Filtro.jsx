
const Filtro = () => {
  return (
    <form className="d-flex gap-3 filtro">
        <label htmlFor="">Filtro:</label>
        <select name="" id="">
            <option value="">--Seleccione Mes--</option>
            <option value="">Enero</option>
            <option value="">Febrero</option>
            <option value="">Marzo</option>
            <option value="">Abril</option>
            <option value="">Mayo</option>
            <option value="">Junio</option>
            <option value="">Julio</option>
            <option value="">Agosto</option>
            <option value="">Septiembre</option>
            <option value="">Octubre</option>
            <option value="">Noviembre</option>
            <option value="">Diciembre</option>
        </select>

        <select>
            <option value="">--Seleccione Día--</option>
            <option value="">Lunes</option>
            <option value="">Martes</option>
            <option value="">Miercoles</option>
            <option value="">Jueves</option>
            <option value="">Viernes</option>
        </select>

        <label htmlFor="matricula">Matrícula:</label>
        <input 
            type="text" 
            placeholder="Agrega una Matrícula"
        />

        <input 
            type="submit"
            value="Buscar" 
            className="btn-filtro px-3 py-1"
        />
    </form>
  )
}

export default Filtro
