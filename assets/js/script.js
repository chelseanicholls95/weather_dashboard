const renderCities = () => {};

const getDate = (dt) => {
  var utcSeconds = dt;
  var date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  return date;
};

const getCurrentData = (cityName, currentData) => {
  // from object extract the data points you need for the return data
  const data = {
    name: cityName,
    date: getDate(currentData.dt),
    iconURL: "",
    temperature: currentData.temp,
    humidity: currentData.humidity,
    windSpeed: currentData.wind_speed,
    uvIndex: currentData.uvi,
  };
  return data;
};

const getForecastData = (dailyData) => {
  // iterate and construct the return data array (map)
  const data = {
    date: getDate(dailyData.dt),
    iconURL: "",
    temperature: dailyData.temp.day,
    humidity: dailyData.humidity,
  };
  return data;
};

const renderCurrentCard = (currentData) => {
  // create components
  const currentWeather = `<div class="d-flex justify-content-center mt-3">
  <h2>${currentData.name}, ${currentData.date}</h2>
</div>
<div>
  <div class="m-2">Temperature: ${currentData.temperature} °C</div>
  <div class="m-2">Humidity: ${currentData.humidity}</div>
  <div class="m-2">Wind Speed: ${currentData.windSpeed}</div>
  <div class="m-2">UV Index: ${currentData.uvIndex}</div>
</div>`;
  // append to container
  $("#current-weather").append(currentWeather);
};

const renderForecastCard = (forecastData) => {
  const forecastWeather = `<div
    class="card text-white bg-primary m-2"
    style="min-width: 10rem"
  >
    <div class="card-header">${forecastData.date}</div>
    <div class="card-body">
      <h5 class="card-title">Icon here</h5>
      <p class="card-text">Temperature: ${forecastData.temperature}</p>
      <p class="card-text">Humidity: ${forecastData.humidity}</p>
    </div>
  </div>`;

  $("#7-day-forecast").append(forecastWeather);
};

const fetchAllWeatherData = (cityName) => {
  // remove previous cities weather
  $("#current-weather").empty();
  $("#7-day-forecast").empty();

  // construct url
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a6cdce351d249a3594ef62adb60dd561&units=metric`;

  const functionForJSON = (responseObject) => responseObject.json();

  const functionForApplication = (dataFromServer) => {
    const cityName = dataFromServer.name;
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=a6cdce351d249a3594ef62adb60dd561&units=metric`;

    const functionForJSON = (responseObject) => responseObject.json();

    const functionForApplication = (dataFromServer) => {
      // get current data and forecast data from dataFromServer
      const currentData = getCurrentData(cityName, dataFromServer.current);
      const forecastData = dataFromServer.daily.map(getForecastData);
      // render current and forecast data
      renderCurrentCard(currentData);
      forecastData.forEach(renderForecastCard);
    };

    const functionToHandleError = (errorObject) => {
      // handle your error here according to your application
    };

    fetch(url)
      .then(functionForJSON)
      .then(functionForApplication)
      .catch(functionToHandleError);
  };

  const functionToHandleError = (errorObject) => {};

  fetch(url)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

const getCitiesFromLocalStorage = () => {
  // get cities from local storage
  const citiesFromLocalStorage = localStorage.getItem("cities");

  if (citiesFromLocalStorage) {
    return JSON.parse(citiesFromLocalStorage);
  } else {
    return [];
  }
};

const onLoad = () => {
  // read from local storage and store data in variable called citiesFromLocalStorage
  const citiesFromLocalStorage = getCitiesFromLocalStorage();
  // if data is present and pass the data from local storage
  if (citiesFromLocalStorage) {
    renderCities(citiesFromLocalStorage);
  }
  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  const length = citiesFromLocalStorage.length;
  const index = length - 1;
  const lastCity = citiesFromLocalStorage[index];

  console.log(index);

  fetchAllWeatherData(lastCity);
};

const onSubmit = (event) => {
  event.preventDefault();
  // get input value and fetch weather for that city
  const cityName = $(".form-control").val();
  fetchAllWeatherData(cityName);

  // save to local storage
  const citiesFromLocalStorage = getCitiesFromLocalStorage();
  citiesFromLocalStorage.push(cityName);
  localStorage.setItem("cities", JSON.stringify(citiesFromLocalStorage));
};

$("#form").submit(onSubmit);
$(document).ready(onLoad);
