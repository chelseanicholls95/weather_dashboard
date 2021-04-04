const onClick = (event) => {
  // get target of click
  const target = $(event.target);
  if (target.is("li")) {
    // get text from target and fetch weather data for that city
    const cityName = target.text();
    fetchAllWeatherData(cityName);
  }
};

const renderCities = (city) => {
  // add list item to top of search history list
  const listItem = `<li class="list-group-item" id="city">${city}</li>`;
  $(".list-group").prepend(listItem);
};

const getDate = (dt) => {
  // convert to date
  const utcSeconds = dt;
  const date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  return date;
};

const getIconUrl = (weather) => {
  const iconCode = weather[0].icon;
  const url = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return url;
};

const getCurrentData = (cityName, currentData) => {
  // extract data from current data
  const data = {
    name: cityName,
    date: getDate(currentData.dt),
    iconURL: getIconUrl(currentData.weather),
    temperature: currentData.temp,
    humidity: currentData.humidity,
    windSpeed: currentData.wind_speed,
    uvIndex: currentData.uvi,
  };

  console.log(data);
  return data;
};

const getForecastData = (dailyData) => {
  // extract data from the forecast data
  const data = {
    date: getDate(dailyData.dt),
    iconURL: getIconUrl(dailyData.weather),
    temperature: dailyData.temp.day,
    humidity: dailyData.humidity,
  };
  return data;
};

const renderCurrentCard = (currentData) => {
  // create elements
  const currentWeather = `<div class="d-flex justify-content-center mt-3">
  <h2>${currentData.name}, ${currentData.date} <img src="${currentData.iconURL}" /></h2>
  </div>
<div>
  <div class="m-2">Temperature: ${currentData.temperature} °C</div>
  <div class="m-2">Humidity: ${currentData.humidity}%</div>
  <div class="m-2">Wind Speed: ${currentData.windSpeed} MPH</div>
  <div class="m-2">UV Index: <span class="uv-index" id="uv-index">${currentData.uvIndex}</span></div>
</div>`;

  // append to container
  $("#current-weather").append(currentWeather);
};

const renderForecastCard = (forecastData) => {
  // create elements
  const forecastWeather = `<div
    class="card text-white bg-primary m-2"
    style="min-width: 10rem"
  >
    <div class="card-header">${forecastData.date}</div>
    <div class="card-body">
      <h5 class="card-title"><img src="${forecastData.iconURL}" /></h5>
      <p class="card-text">Temperature: ${forecastData.temperature} °C</p>
      <p class="card-text">Humidity: ${forecastData.humidity}%</p>
    </div>
  </div>`;

  // append to container
  $("#7-day-forecast").append(forecastWeather);
};

const fetchAllWeatherData = (cityName = "Solihull") => {
  // remove previous cities weather
  $("#current-weather").empty();
  $("#7-day-forecast").empty();

  // construct url
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a6cdce351d249a3594ef62adb60dd561&units=metric`;

  const functionForJSON = (responseObject) => responseObject.json();

  const functionForApplication = (dataFromServer) => {
    // get city name, lat and lon from data
    const cityName = dataFromServer.name;
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;

    // construct url
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
    citiesFromLocalStorage.forEach(renderCities);
  }

  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  const length = citiesFromLocalStorage.length;
  const index = length - 1;
  const lastCity = citiesFromLocalStorage[index];

  // fetch data for last searched city
  fetchAllWeatherData(lastCity);
};

const onSubmit = (event) => {
  event.preventDefault();
  // get input value, fetch weather for that city and add to search history list
  const cityName = $(".form-control").val();
  fetchAllWeatherData(cityName);
  renderCities(cityName);
  $(".form-control").val("");

  // save to local storage
  const citiesFromLocalStorage = getCitiesFromLocalStorage();
  citiesFromLocalStorage.push(cityName);
  localStorage.setItem("cities", JSON.stringify(citiesFromLocalStorage));
};

$(".list-group").click(onClick);
$("#form").submit(onSubmit);
$(document).ready(onLoad);
