import { useEffect, useState } from 'react'
import './App.css'
import propTypes from "prop-types";

 /*Images*/

 import searchIcon from './assets/sear.png';
 import cloudIcon from './assets/cloudy.png';
 import sunIcon from './assets/sunrise.png';
 import humidityIcon from './assets/humidity.png';
 import rainIcon from './assets/rain.png';
 import winterIcon from './assets/winter.png';
 import drizzleIcon from './assets/drizzle.png';
 import windIcon from './assets/storm.png';




 const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind}) =>{
     return(<>
       <div className="image">
        <img src={icon} alt="Image"/>
       </div>
       <div className="temp">{temp}°C</div>
       <div className="Location">{city}</div>
       <div className="country">{country}</div>
       <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
        <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
       </div>
       <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon"/>
          <div className="data">
            <div className="Humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon"/>
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
       </div>
     </>
     );
 };


WeatherDetails.propTypes = {
  icon:propTypes.string.isRequired,
  temp:propTypes.number.isRequired,
  city:propTypes.string.isRequired,
  country:propTypes.string.isRequired,
  humidity:propTypes.number.isRequired,
  wind:propTypes.number.isRequired,
  lat:propTypes.number.isRequired,
  log:propTypes.number.isRequired,
};






function App() {
 
  let api_key = "ecd4555c40c53311f46ebaa13e5fa257";
  const [text,setText] = useState(""); 



  const[icon,setIcon] = useState(winterIcon);
  const[temp,setTemp] = useState(0);
  const[city,setCity] = useState("");
  const[country,setCountry] = useState("");
  const[lat,setLat] = useState(0);
  const[log,setLog] = useState(0);
  const[humidity,setHumidity] = useState(0);
  const [wind,setWind] = useState(0);  

  const[cityNotFound,setCityNotFound] = useState(false);
  const[loading,setLoading] = useState(false);
  const[error,setError] = useState(null);

  const weatherIconMap = {
    "01d":sunIcon,
    "01n":sunIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":winterIcon,
    "13n":winterIcon,
  };






  const search = async () =>{
    setLoading(true);
    
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

   try{
      let res = await fetch(url);
      let data = await res.json();
      //console.log(data);
      if(data.cod === "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

       setHumidity(data.main.humidity);
       setWind(data.wind.speed);
       setTemp(Math.floor(data.main.temp));
       setCity(data.name);
       setCountry(data.sys.country);
       setLat(data.coord.lat);
       setLog(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sunIcon);
      setCityNotFound(false);
}catch(error){
    console.error("An error occurred:",error.message);
    setError("An error occurred while fetching weather data.");
   }finally{
     setLoading(false);
  }
   };

const handleCity = (e) => {
  setText(e.target.value);
};
const handleKeyDown = (e) => {
  if (e.key === "Enter"){
    search();
  }
};

useEffect(function (){
  search();
},[]);

  return (
    <>
    <div className="container">
      <div className="input-container">
        <input type="text" 
        className="cityInput"
        placeholder="Search City" onChange={handleCity} value={text}
        onKeyDown={handleKeyDown}/>

        <div className="search-icon" onClick={()=>
          search()}>
          <img src={searchIcon} alt="search"/>
        </div>
      </div>
      

         {loading && <div className="loading-message">Loading...</div>}
         {cityNotFound && <div className="city-not-found">City not found</div>}

         {!loading  && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}


      <p className="copyright">
         Designed by <span>Sujitha Subramanian</span>
      </p>

      </div>
    </>
  );
}

export default App;
