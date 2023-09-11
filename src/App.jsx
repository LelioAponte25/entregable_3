import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import LocationInfo from './components/LocationInfo';
import ResidentCard from './components/ResidentCard';
import Loading from './components/Loading';

function App() {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const inputSearch = useRef();
  const [currentPage, setCurrentPage] = useState(20); // Establecer la página inicial en 20
  const cardsPerPage = 10;

  useEffect(() => {
    if (inputValue.trim() !== '') {
      // Realiza la búsqueda de ubicaciones sugeridas basadas en el valor de entrada.
      // Utiliza la API de Rick and Morty para obtener sugerencias de ubicaciones.
      // Actualiza el estado de suggestedLocations con las ubicaciones sugeridas.
      axios
        .get(`https://rickandmortyapi.com/api/location/?name=${inputValue}`)
        .then((response) => {
          const suggestedLocations = response.data.results;
          setSuggestedLocations(suggestedLocations);
        })
        .catch((error) => {
          console.error('Error fetching suggested locations:', error);
        });
    } else {
      // Si el campo de entrada está vacío, borra las sugerencias.
      setSuggestedLocations([]);
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Al hacer clic en "Search", realiza una búsqueda de ubicación completa basada en el nombre ingresado.
    // Utiliza la API de Rick and Morty para buscar la ubicación por nombre.
    // Actualiza la información de ubicación en tu aplicación.
    setIsLoading(true);
    axios
      .get(`https://rickandmortyapi.com/api/location/?name=${inputValue}`)
      .then((response) => {
        setIsLoading(false);
        const locations = response.data.results;
        if (locations.length > 0) {
          setLocation(locations[0]); // Tomamos la primera ubicación encontrada.
          setError('');
        } else {
          setLocation(null);
          setError('❌ Location not found.');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setLocation(null);
        setError('❌ Error fetching location data.');
      });
  };

  const handleLocationClick = (selectedLocation) => {
    // Cuando el usuario hace clic en una ubicación sugerida, actualiza el valor del campo de entrada.
    setInputValue(selectedLocation.name);

    // Realiza una búsqueda de ubicación completa basada en selectedLocation.id
    // Utiliza la API de Rick and Morty para obtener detalles de ubicación por nombre.
    // Actualiza la información de ubicación en tu aplicación.
    setIsLoading(true);
    axios
      .get(`https://rickandmortyapi.com/api/location/?name=${selectedLocation.name}`)
      .then((response) => {
        setIsLoading(false);
        const locations = response.data.results;
        if (locations.length > 0) {
          setLocation(locations[0]); // Tomamos la primera ubicación encontrada.
          setError('');
        } else {
          setLocation(null);
          setError('❌ Location not found.');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setLocation(null);
        setError('❌ Error fetching location data.');
      });
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const cardsToShow = location?.residents.slice(indexOfFirstCard, indexOfLastCard) || [];

  const totalPages = Math.ceil(location?.residents.length / cardsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='container__father'>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className='caja__img'>
            <div className='container__img'>
              <div className='img__item'></div>
            </div>
          </div>
          <form className='form__center' onSubmit={handleSubmit}>
            <input
              placeholder='Search'
              className='input'
              ref={inputSearch}
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className='search'>
              <span>Search</span>
            </button>
          </form>
          {suggestedLocations.length > 0 && (
            <div className='suggested-locations'>
              <ul>
                {suggestedLocations.map((location) => (
                  <li key={location.id} onClick={() => handleLocationClick(location)}>
                    {location.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && (
            <div className='container__error'>
              <h2>{error}</h2>
              <br />
              <h2>Recargue la página nuevamente...</h2>
            </div>
          )}
          {location && (
            <>
              <LocationInfo location={location} />
              <div className='pagination'>
                <button className='next' onClick={prevPage} disabled={currentPage === 1}>
                  Previus
                </button>
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={pageNumber === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button className='prev' onClick={nextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
              <div className='resident-grid'>
                {cardsToShow.map((url) => (
                  <ResidentCard key={url} url={url} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
