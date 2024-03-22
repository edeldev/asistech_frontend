const Filtro = ({
  matriculaMaestro,
  setMatricula,
  dia,
  setDia,
  mes,
  setMes,
  handleClear,
}) => {
  return (
    <form className="d-flex gap-3 filtro">
      <label htmlFor="matricula">Matrícula:</label>
      <input
        type="text"
        placeholder="Agrega una Matrícula"
        value={matriculaMaestro}
        onChange={(e) => setMatricula(e.target.value)}
      />
      <label htmlFor="dia">Dia:</label>
      <input
        type="text"
        placeholder="Agrega un día"
        value={dia}
        onChange={(e) => setDia(e.target.value)}
      />
      <label htmlFor="mes">Mes:</label>
      <input
        type="text"
        placeholder="Agrega un mes"
        value={mes}
        onChange={(e) => setMes(e.target.value)}
      />
      <button className="submit" onClick={handleClear}>
        Limpiar filtros
      </button>
    </form>
  );
};

export default Filtro;
