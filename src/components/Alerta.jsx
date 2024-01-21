
const Alerta = ({alerta}) => {
  return (
    <div 
        className={
            `${
                alerta.error 
                ? 'alerta' 
                : 'bg-success'
            } 
                text-center p-2 rounded text-uppercase text-white fw-bold my-3`
            }>
        {alerta.msg}
    </div>
  )
}

export default Alerta
