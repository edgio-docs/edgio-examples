const Mission = ({ mission_name, launch_date_local, launch_site: { site_name_long }, rocket: { rocket_name } }) => (
  <div className="mt-3 w-full px-3 py-2 rounded shadow border">
    <h3 className="font-bold">{mission_name}</h3>
    <small>{new Date(launch_date_local).toLocaleDateString()}</small>
    <p className="truncate mt-2">
      {rocket_name} will launch from {site_name_long}
    </p>
  </div>
)

export default Mission
