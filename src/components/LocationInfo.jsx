import './LocationInfo.css'

const LocationInfo = ({location}) => {

    return (
      <div className='container__center'>
      <article className="container">
        <h2 className="container__location">{location?.name}</h2>
        <ul className="container__list">
        <li className="list__item"><span className="list__label">Type: </span><span className="list__value">{location?.type}</span></li>
        <li className="list__item"><span className="list__label">Dimension: </span><span className="list__value">{location?.dimension || 'unknown'}</span></li>
        <li className="list__item"><span className="list__label">Population: </span><span className="list__value">{location?.residents.length}</span></li>
      </ul>
    </article>
      </div>

)
}

export default LocationInfo