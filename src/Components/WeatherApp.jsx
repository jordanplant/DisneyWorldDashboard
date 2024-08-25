import React, { useState, useEffect } from "react";
import { useSwipeable } from 'react-swipeable';

import "./WeatherApp.css";

function WeatherApp({ city }) {
  const [weatherData, setWeatherData] = useState({
    temp: "",
    humidity: "",
    windSpeed: "",
    sunset: "",
    weatherIcon: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

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

          const newWeatherData = {
            temp: Math.round(data.main.temp) + "°C",
            humidity: data.main.humidity + "%",
            windSpeed: data.wind.speed + " km/h",
            sunset: formattedSunsetTime,
          };
          setWeatherData(newWeatherData);
          updateWeatherIcon(data.weather[0].main);
        } else {
          console.error("Failed to fetch weather data");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }

    fetchWeatherData();
  }, [city, apiUrl]);

  function updateWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
      case "Clouds":
        setWeatherData((prevState) => ({
          ...prevState,
          weatherIcon: (
            <svg
              className="cloudyDay"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M9.5 6C5.91015 6 3 8.91015 3 12.5C3 16.0899 5.91015 19 9.5 19H16.5C18.9853 19 21 16.9853 21 14.5C21 12.0147 18.9853 10 16.5 10C16.1717 10 15.8516 10.0352 15.5433 10.1019C14.589 7.69894 12.2429 6 9.5 6ZM16.5 21H9.5C4.80558 21 1 17.1944 1 12.5C1 7.80558 4.80558 4 9.5 4C12.5433 4 15.2131 5.59939 16.7146 8.00348C20.2051 8.11671 23 10.982 23 14.5C23 18.0899 20.0899 21 16.5 21Z"></path>
            </svg>
          ),
        }));
        break;
      case "Clear":
        setWeatherData((prevState) => ({
          ...prevState,
          weatherIcon: (
            <svg
              className="clearDay"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>
            </svg>
          ),
        }));
        break;
      case "Rain":
        setWeatherData((prevState) => ({
          ...prevState,
          weatherIcon: (
            <svg
              className="rain"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5 16.9297C2.60879 15.5465 1 12.9611 1 10C1 5.58172 4.58172 2 9 2C12.3949 2 15.2959 4.11466 16.4576 7.09864C16.7951 7.0339 17.1436 7 17.5 7C20.5376 7 23 9.46243 23 12.5C23 15.0176 21.3085 17.14 19 17.793V15.6632C20.1825 15.1015 21 13.8962 21 12.5C21 10.567 19.433 9 17.5 9C16.5205 9 15.6351 9.40232 14.9998 10.0507C14.9999 10.0338 15 10.0169 15 10C15 6.68629 12.3137 4 9 4C5.68629 4 3 6.68629 3 10C3 11.777 3.7725 13.3736 5 14.4722V16.9297ZM7 14H9V20H7V14ZM15 14H17V20H15V14ZM11 17H13V23H11V17Z"></path>
            </svg>
          ),
        }));
        break;
      case "Drizzle":
        setWeatherData((prevState) => ({
          ...prevState,
          weatherIcon: (
            <svg
              className="drizzle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M17 18V16H17.5C19.433 16 21 14.433 21 12.5C21 10.567 19.433 9 17.5 9C16.5205 9 15.6351 9.40232 14.9998 10.0507C14.9999 10.0338 15 10.0169 15 10C15 6.68629 12.3137 4 9 4C5.68629 4 3 6.68629 3 10C3 12.6124 4.66962 14.8349 7 15.6586V17.748C3.54955 16.8599 1 13.7277 1 10C1 5.58172 4.58172 2 9 2C12.3949 2 15.2959 4.11466 16.4576 7.09864C16.7951 7.0339 17.1436 7 17.5 7C20.5376 7 23 9.46243 23 12.5C23 15.5376 20.5376 18 17.5 18H17ZM13 16.0048H16L11 22.5048V18.0048H8L13 11.5V16.0048Z"></path>
            </svg>
          ),
        }));
        break;
      case "Thunderstorm":
        setWeatherData((prevState) => ({
          ...prevState,
          weatherIcon: (
            <svg
              className="thunderstorm"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M17 18V16H17.5C19.433 16 21 14.433 21 12.5C21 10.567 19.433 9 17.5 9C16.5205 9 15.6351 9.40232 14.9998 10.0507C14.9999 10.0338 15 10.0169 15 10C15 6.68629 12.3137 4 9 4C5.68629 4 3 6.68629 3 10C3 12.6124 4.66962 14.8349 7 15.6586V17.748C3.54955 16.8599 1 13.7277 1 10C1 5.58172 4.58172 2 9 2C12.3949 2 15.2959 4.11466 16.4576 7.09864C16.7951 7.0339 17.1436 7 17.5 7C20.5376 7 23 9.46243 23 12.5C23 15.5376 20.5376 18 17.5 18H17ZM13 16.0048H16L11 22.5048V18.0048H8L13 11.5V16.0048Z"></path>
            </svg>
          ),
        }));
        break;
      default:
        setWeatherData((prevState) => ({
          ...prevState,
          weatherIcon: "",
        }));
        break;
    }
  }

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
          <div className="weather-icon">{weatherData.weatherIcon}</div>
          <h3 className="temp">{weatherData.temp}</h3>
          <h4 className="city">{city}</h4>
        </div>
      ),
    },
    {
      content: (
        <div className="details">
          <div className="col">
            <svg className="humidity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M7.05025 8.04673L12 3.09698L16.9497 8.04673C19.6834 10.7804 19.6834 15.2126 16.9497 17.9462C14.2161 20.6799 9.78392 20.6799 7.05025 17.9462C4.31658 15.2126 4.31658 10.7804 7.05025 8.04673ZM18.364 6.63252L12 0.268555L5.63604 6.63252C2.12132 10.1472 2.12132 15.8457 5.63604 19.3604C9.15076 22.8752 14.8492 22.8752 18.364 19.3604C21.8787 15.8457 21.8787 10.1472 18.364 6.63252ZM16.2427 10.1714L14.8285 8.75718L7.7574 15.8282L9.17161 17.2425L16.2427 10.1714ZM8.11095 11.232C8.69674 11.8178 9.64648 11.8178 10.2323 11.232C10.8181 10.6463 10.8181 9.69652 10.2323 9.11073C9.64648 8.52494 8.69674 8.52494 8.11095 9.11073C7.52516 9.69652 7.52516 10.6463 8.11095 11.232ZM15.8891 16.8889C15.3033 17.4747 14.3536 17.4747 13.7678 16.8889C13.182 16.3031 13.182 15.3534 13.7678 14.7676C14.3536 14.1818 15.3033 14.1818 15.8891 14.7676C16.4749 15.3534 16.4749 16.3031 15.8891 16.8889Z"></path>
            </svg>
            <div>
              <p className="humidity">{weatherData.humidity}</p>
              <p>Humidity</p>
            </div>
          </div>
          <div className="col">
            <svg className="wind" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M10.5 17H4V15H10.5C12.433 15 14 16.567 14 18.5C14 20.433 12.433 22 10.5 22C8.99957 22 7.71966 21.0559 7.22196 19.7293L9.09513 19.0268C9.30843 19.5954 9.85696 20 10.5 20C11.3284 20 12 19.3284 12 18.5C12 17.6716 11.3284 17 10.5 17ZM5 11H18.5C20.433 11 22 12.567 22 14.5C22 16.433 20.433 18 18.5 18C16.9996 18 15.7197 17.0559 15.222 15.7293L17.0951 15.0268C17.3084 15.5954 17.857 16 18.5 16C19.3284 16 20 15.3284 20 14.5C20 13.6716 19.3284 13 18.5 13H5C3.34315 13 2 11.6569 2 10C2 8.34315 3.34315 7 5 7H13.5C14.3284 7 15 6.32843 15 5.5C15 4.67157 14.3284 4 13.5 4C12.857 4 12.3084 4.40463 12.0951 4.97317L10.222 4.27073C10.7197 2.94414 11.9996 2 13.5 2C15.433 2 17 3.567 17 5.5C17 7.433 15.433 9 13.5 9H5C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11Z"></path>
            </svg>
            <div>
              <p className="wind">{weatherData.windSpeed}</p>
              <p>Wind Speed</p>
            </div>
          </div>
          <div className="col">
            <svg className="sunset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
            </svg>
            <div>
              <p className="sunset">{weatherData.sunset}</p>
              <p>Sunset</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="weather-text">
          <div className="weather-icon">{weatherData.weatherIcon}</div>
          <h3 className="temp">{weatherData.temp}</h3>
          <h4 className="city">{city}</h4>
        </div>
      ),
    },
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
