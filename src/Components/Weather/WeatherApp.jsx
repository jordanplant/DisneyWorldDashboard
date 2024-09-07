import React, { useState, useEffect } from "react";
import { useSwipeable } from 'react-swipeable';
import WeatherIcon from "./WeatherIcon";
import "./WeatherApp.css";

function WeatherApp({ city }) {
  const [weatherData, setWeatherData] = useState({
    temp: "",
    feels_like: "",
    humidity: "",
    windSpeed: "",
    sunset: "",
    weatherIcon: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isNight, setIsNight] = useState(false);

  const apiKey = "dea94289dbb3a89081f073f4f8e0d0a0";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
  
          // Calculate the local sunset time using the correct timezone
          const sunsetTimeUTC = new Date(data.sys.sunset * 1000);
          const timezone = `Etc/GMT${data.timezone < 0 ? "+" : "-"}${Math.abs(data.timezone) / 3600}`;
          const formattedSunsetTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: timezone,
          }).format(sunsetTimeUTC);
  
          // Check if it's night
          const currentTime = new Date();
          const currentHour = currentTime.getHours();
          const sunsetHour = parseInt(formattedSunsetTime.split(':')[0]);
          setIsNight(currentHour >= sunsetHour || currentHour < 6);
  
          const newWeatherData = {
            temp: Math.round(data.main.temp) + "°C",
            feels_like: Math.round(data.main.feels_like) + "°C",
            humidity: data.main.humidity + "%",
            windSpeed: data.wind.speed + " km/h",
            sunset: formattedSunsetTime,
            weatherCondition: data.weather[0].main
          };
          setWeatherData(newWeatherData);
        } else {
          console.error("Failed to fetch weather data");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }}
  
    fetchWeatherData();
  }, [city, apiUrl]);


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage((prev) => Math.min(prev + 1, pages.length)),
    onSwipedRight: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    // Optional: Customize the swipe delta and other options if needed
    swipeThreshold: 50, // Minimum pixels to trigger a swipe
  });
  

  const pages = [
    {
      content: (
        <div className="weather-text">
          <div className="weather-icon">
            <WeatherIcon weatherCondition={weatherData.weatherCondition} />
          </div>
          <h3 className="temp">{weatherData.temp}</h3>
          <span className="feelsLikeContainer">
            <h5 className="feelsLike">Feels like</h5>
            <h5 className="feelsLikeTemp">{weatherData.feels_like}</h5>
          </span>
        </div>
      ),
    },
    {
content: (
  <div className="details">
    <div className="col">
      <WeatherIcon weatherCondition="humidity" />
      <div>
        <p className="humidity">{weatherData.humidity}</p>
        <p>Humidity</p>
      </div>
    </div>
    <div className="col">
      <WeatherIcon weatherCondition="wind" />
      <div>
        <p className="wind">{weatherData.windSpeed}</p>
        <p>Wind Speed</p>
      </div>
    </div>
    <div className="col">
      <WeatherIcon weatherCondition="sunset" />
      <div>
        <p className="sunset">{weatherData.sunset}</p>
        <p>Sunset</p>
      </div>
    </div>
  </div>
),
    },
    // {
    //   content: (
    //     <div className="weather-text">
    //       <div className="weather-icon">{weatherData.weatherIcon}</div>
    //       <h3 className="temp">{weatherData.temp}</h3>
    //       <h4 className="city">{city}</h4>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="weatherContainer" {...swipeHandlers}>
      <div className="weather">
        {pages[currentPage - 1].content}
      </div>
      <div className="dots-container">
        {pages.map((_, index) => (
          <div 
            key={index}
            className={`dot ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(index + 1)}
          ></div>
        ))}
      </div>
    </div>
  );
  
}


export default WeatherApp;
