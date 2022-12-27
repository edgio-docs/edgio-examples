const Rocket = ({ description, name }) => (
  <div className="mt-3 w-full px-3 py-2 rounded shadow border">
    <h3 className="font-bold">{name}</h3>
    <p className="line-clamp-2 leading-7">{description}</p>
  </div>
)

export default Rocket
