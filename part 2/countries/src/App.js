import React, { useEffect, useState } from "react";
import axios from "axios";

const CountryListItem = ({ country, handleBtn }) => (
  <li key={country.callingCodes}>
    {country.name.common}{" "}
    <button value={country.name.common} onClick={handleBtn}>
      show
    </button>
  </li>
);

const CountryDetail = ({ country, weather }) => (
  <>
    <h1>{country.name.common}</h1>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h3>languages</h3>
    <ul style={{ listStyleType: "disc" }}>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img alt="flag" src={country.flags.svg} width="100" height="100" />
    {weather ? (
      <>
        <h3>Weather in {country.capital}</h3>
        <p>
          <strong>temperature: </strong>
          {weather.main.temp} Celsius
        </p>
        <img alt="descriptor" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} />
        <p>
          <strong>wind: </strong>
          {weather.wind.speed} kph
        </p>
      </>
    ) : (
      <p>Weather API usage has exceeded access for the host of this server.</p>
    )}
  </>
);

const App = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setData(response.data));
  }, []);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleBtn = (event) => {
    setQuery(event.target.value);
  };

  const results = data.filter(country =>
    country.name.common.toLowerCase().startsWith(query.toLowerCase())
  );

  useEffect(() => {
    setWeather(null); // Reset weather data whenever results change
    if (results.length === 1) {
      const fetchWeather = async () => {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${results[0].capital}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`);
        setWeather(response.data);
      };
      fetchWeather();
      const intervalId = setInterval(fetchWeather, 60 * 60 * 1000); // Refresh every hour
      return () => clearInterval(intervalId); // Clear interval when component unmounts or results change
    }
  }, [results]);

  return (
    <>
      <form onSubmit={(event) => event.preventDefault()}>
        find countries <input onChange={handleQueryChange} />
      </form>
      {results.length > 10 && query && (
        <p>Too many matches, specify another filter</p>
      )}
      {results.length > 1 && results.length <= 10 && (
        <ul style={{ listStyleType: "none" }}>
          {results.map(country => (
            <CountryListItem key={country.name.common} country={country} handleBtn={handleBtn} />
          ))}
        </ul>
      )}
      {results.length === 1 && (
        <CountryDetail country={results[0]} weather={weather} />
      )}
    </>
  );
};

export default App;
