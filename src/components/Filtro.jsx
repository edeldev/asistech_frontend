const Filtro = () => {
  return (
    <form className="d-flex gap-3 filtro">
      <label htmlFor="">Filtro:</label>
      {/* Fecha */}

      <label htmlFor="matricula">Matrícula:</label>
      <input type="text" placeholder="Agrega una Matrícula" />

      <input type="submit" value="Buscar" className="btn-filtro px-3 py-1" />
    </form>
  );
};

export default Filtro;
