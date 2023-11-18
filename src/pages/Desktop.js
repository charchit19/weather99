import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Desktop.module.css";


const Desktop = () => {
  const api = process.env.REACT_APP_API_KEY;
  const indicesToDestructure = [0, 9, 16, 24, 32];
  const kelvinToCelsius = (kelvin) => kelvin - 273.15;
  const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
  const [searchCity, setSearchCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  const [destructuredList, setDestructuredList] = useState([]);
  const [cityName, setCityName] = useState("Mumbai");
  const [stateName, setStateName] = useState("Maharashtra");
  const [lat, setLat] = useState(19.0785451);
  const [lon, setLon] = useState(72.878176);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear':
        return {
          src: '/fluentweathersunnyhigh20regular.svg',
          className: styles.fluentweatherSunnyHigh20RIcon,
        };
      case 'Clouds':
        return {
          src: '/materialsymbolsweathersnowyoutline.svg',
          className: styles.materialSymbolsweatherSnowyIcon,
        };
      case 'Rain':
        return {
          src: '/carbonmixedrainhail.svg',
          className: styles.carbonmixedRainHailIcon,
        };
      case 'Wind':
        return {
          src: '/mdiweatherwindy.svg',
          className: styles.mdiweatherWindyIcon,
        };
      case 'Thunderstorm':
        return {
          src: '/carbonmixedrainhail1.svg',
          className: styles.carbonmixedRainHailIcon1,
        };
      default:
        return {
          src: '/fluentweathersunnyhigh20regular.svg',
          className: styles.fluentweatherSunnyHigh20RIcon,
        }; // You can provide a default icon or handle other cases as needed
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchCity(event.target.value);
  };

  const handleRefreshClick = () => {
    window.location.reload();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      try {
        await fetchWeatherData();
      } catch (error) {
        console.error("Error while fetching weather data", error);
      }
    }
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=5&appid=${api}`
      );

      if (response.ok) {
        const data = await response.json();
        setStateName(data[0].state);
        setCityName(data[0].name);

        if (data.length > 0) {
          setLat(data[0].lat);
          setLon(data[0].lon);

          const response2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api}`
          );

          if (response2.ok) {
            const data2 = await response2.json();
            setWeatherData(data2);
            updateDestructuredList(data2);
          } else {
            console.error("Failed to fetch weather data for the current time");
          }
        }
      } else {
        console.error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Error while fetching weather data", error);
    }
  };

  const updateDestructuredList = (data) => {
    const {
      city: { sunrise, sunset },
      list,
    } = data;

    const updatedDestructuredList = indicesToDestructure.map((index) => {
      const {
        dt,
        dt_txt,
        main: { temp_min, temp_max, humidity },
        weather,
      } = list[index];

      const minTempCelsius = Math.round(kelvinToCelsius(temp_min));
      const maxTempCelsius = Math.round(kelvinToCelsius(temp_max));

      const minTempFahrenheit = Math.round(celsiusToFahrenheit(minTempCelsius));
      const maxTempFahrenheit = Math.round(celsiusToFahrenheit(maxTempCelsius));

      const sunriseTimestamp = sunrise;
      const sunsetTimestamp = sunset;

      const sunriseDate = new Date(sunriseTimestamp * 1000);
      const sunsetDate = new Date(sunsetTimestamp * 1000);

      const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes} ${ampm}`;
      };

      const formattedSunrise = formatTime(sunriseDate);
      const formattedSunset = formatTime(sunsetDate);

      const weatherMain = weather[0].main;

      const dateObj = new Date(dt_txt);
      const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;

      return {
        dt,
        dt_txt: formattedDate,
        minTempCelsius,
        maxTempCelsius,
        minTempFahrenheit,
        maxTempFahrenheit,
        humidity,
        formattedSunrise,
        formattedSunset,
        weatherMain,
      };
    });

    setDestructuredList(updatedDestructuredList);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (weatherData) {
      updateDestructuredList(weatherData);
    }
  }, [weatherData]);

  if (!weatherData) {
    return null;
  }

  const maxDate = new Date();

  return (
    <div className={styles.desktop}>
      <div className={styles.desktopChild} />
      <div className={styles.searchBoxRectangle} />
      <b className={styles.refresh} onClick={handleRefreshClick}>
        Refresh
      </b>
      <img
        className={styles.mdirefreshCircleIcon}
        alt=""
        src="/mdirefreshcircle.svg"
      />
      <img
        className={styles.mdiweatherSunWirelessOutliIcon}
        alt=""
        src="/mdiweathersunwirelessoutline.svg"
      />
      <b className={styles.weather99}>Weather 99</b>
      <div className={styles.highTemperatureLowTemperatuParent}>
        <div className={styles.highTemperatureLowContainer}>
          <p className={styles.highTemperature}>High Temperature</p>
          <p className={styles.highTemperature}>&nbsp;</p>
          <p className={styles.highTemperature}>Low Temperature</p>
          <p className={styles.highTemperature}>&nbsp;</p>
          <p className={styles.highTemperature}>Humidity</p>
          <p className={styles.highTemperature}>&nbsp;</p>
          <p className={styles.highTemperature}>Sunrise Time</p>
          <p className={styles.highTemperature}>&nbsp;</p>
          <p className={styles.highTemperature}>Sunset Time</p>
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.groupChild} />
          <img
            className={getWeatherIcon(destructuredList[0].weatherMain).className}
            alt=""
            src={getWeatherIcon(destructuredList[0].weatherMain).src}
          />
          <div className={styles.groupItem} />
          <b className={styles.c63fContainer}>
            <p className={styles.highTemperature}>{destructuredList[0].maxTempCelsius}°C / {destructuredList[0].maxTempFahrenheit}°F </p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[0].minTempCelsius}°C / {destructuredList[0].minTempFahrenheit}°F</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[0].humidity}%</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[0].formattedSunrise}</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[0].formattedSunset}</p>
          </b>
          <b className={styles.sunny}>{destructuredList[0].weatherMain}</b>
          <b className={styles.jan2023}>{destructuredList[0].dt_txt}</b>
        </div>
        <div className={styles.rectangleGroup}>
          <div className={styles.groupChild} />
          <img
            className={getWeatherIcon(destructuredList[1].weatherMain).className}
            alt=""
            src={getWeatherIcon(destructuredList[1].weatherMain).src}
          />
          <div className={styles.groupItem} />
          <b className={styles.c63fContainer}>
            <p className={styles.highTemperature}>{destructuredList[1].maxTempCelsius}°C / {destructuredList[1].maxTempFahrenheit}°F </p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[1].minTempCelsius}°C / {destructuredList[1].minTempFahrenheit}°F</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[1].humidity}%</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[1].formattedSunrise}</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[1].formattedSunset}</p>
          </b>
          <b className={styles.sunny}>{destructuredList[1].weatherMain}</b>
          <b className={styles.jan2023}>{destructuredList[1].dt_txt}</b>
        </div>
        <div className={styles.rectangleContainer}>
          <div className={styles.groupChild} />
          <img
            className={getWeatherIcon(destructuredList[2].weatherMain).className}
            alt=""
            src={getWeatherIcon(destructuredList[2].weatherMain).src}
          />
          <div className={styles.groupItem} />
          <b className={styles.c63fContainer}>
            <p className={styles.highTemperature}>{destructuredList[2].maxTempCelsius}°C / {destructuredList[2].maxTempFahrenheit}°F </p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[2].minTempCelsius}°C / {destructuredList[2].minTempFahrenheit}°F</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[2].humidity}%</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[2].formattedSunrise}</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[2].formattedSunset}</p>
          </b>
          <b className={styles.sunny}>{destructuredList[2].weatherMain}</b>
          <b className={styles.jan2023}>{destructuredList[2].dt_txt}</b>
        </div>
        <div className={styles.groupDiv}>
          <div className={styles.groupChild} />
          <img
            className={getWeatherIcon(destructuredList[3].weatherMain).className}
            alt=""
            src={getWeatherIcon(destructuredList[3].weatherMain).src}
          />
          <div className={styles.groupItem} />
          <b className={styles.c63fContainer}>
            <p className={styles.highTemperature}>{destructuredList[3].maxTempCelsius}°C / {destructuredList[3].maxTempFahrenheit}°F </p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[3].minTempCelsius}°C / {destructuredList[3].minTempFahrenheit}°F</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[3].humidity}%</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[3].formattedSunrise}</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[3].formattedSunset}</p>
          </b>
          <b className={styles.sunny}>{destructuredList[3].weatherMain}</b>
          <b className={styles.jan2023}>{destructuredList[3].dt_txt}</b>
        </div>
        <div className={styles.rectangleParent1}>
          <div className={styles.groupChild} />
          <img
            className={getWeatherIcon(destructuredList[4].weatherMain).className}
            alt=""
            src={getWeatherIcon(destructuredList[4].weatherMain).src}
          />
          <div className={styles.groupItem} />
          <b className={styles.c63fContainer}>
            <p className={styles.highTemperature}>{destructuredList[4].maxTempCelsius}°C / {destructuredList[4].maxTempFahrenheit}°F </p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[4].minTempCelsius}°C / {destructuredList[4].minTempFahrenheit}°F</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[4].humidity}%</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[4].formattedSunrise}</p>
            <p className={styles.highTemperature}>&nbsp;</p>
            <p className={styles.highTemperature}>{destructuredList[4].formattedSunset}</p>
          </b>
          <b className={styles.sunny}>{destructuredList[4].weatherMain}</b>
          <b className={styles.jan2023}>{destructuredList[4].dt_txt}</b>
        </div>
      </div>
      <div className={styles.n78029EParent}>
        <div className={styles.n78029}>{lat}, {lon}</div>
        <img
          className={styles.materialSymbolsshareLocatioIcon}
          alt=""
          src="/materialsymbolssharelocation.svg"
        />
        <div className={styles.searchBox}>
          {/* <div className={styles.searchBoxRectangle1}> */}
          <input
            className={styles.searchBoxRectangle1}
            type="text"
            // value={searchCity}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search your city here..."
          />
          {/* </div> */}
          <img className={styles.searchIcon} alt="" src="/search-icon.svg" />
        </div>
        <b className={styles.agraUttarPradesh}>{cityName}, {stateName}</b>
        <div className={styles.groupChild6} />
      </div>
      <div className={styles.selectDate}>Select Date:</div>
      <div className={styles.rectangleParent2}>
        <div className={styles.groupChild7} />
        <img
          className={styles.simpleLineIconscalender}
          alt=""
          src="/simplelineiconscalender.svg"
        />
        <DatePicker
          className={styles.datep}
          selected={selectedDate}
          onChange={handleDateChange}
          onKeyDown={handleKeyDown}
          dateFormat="dd MMM yyyy"
          maxDate={maxDate}
          minDate={new Date()}
        />
      </div>
    </div>
  );
};

export default Desktop;