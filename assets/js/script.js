const apiKey = "a6cdce351d249a3594ef62adb60dd561";

const onClick = (event) => {
  // get target of click
  const target = $(event.target);
  if (target.is("li")) {
    // get text from target and fetch weather data for that city
    const cityName = target.text();
    fetchAllWeatherData(cityName);
  }
};

const renderCities = (cities) => {
  $(".list-group").empty();

  const renderCity = (city) => {
    const listItem = `<li class="list-group-item" id="city">${city}</li>`;
    $(".list-group").prepend(listItem);
  };

  cities.forEach(renderCity);
};

const getDate = (datetime) => {
  // convert to date
  const date = new Date(0);
  date.setUTCSeconds(datetime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

const getIconUrl = (weather) => {
  // get icon code and construct url
  const iconCode = weather[0].icon;
  const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return url;
};

const getUvIndexClass = (uvIndex) => {
  if (uvIndex < 2) {
    return "bg-success";
  } else if (uvIndex < 7) {
    return "bg-warning";
  } else {
    return "bg-danger text-white";
  }
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
  const uvIndexClass = getUvIndexClass(currentData.uvIndex);
  const currentWeather = `<div id="current-weather">
  <div class="d-flex justify-content-center mt-3">
  <h2>${currentData.name}, ${currentData.date} <img src="${currentData.iconURL}" /></h2>
  </div>
<div class="mx-5">
  <div class="m-2">Temperature: ${currentData.temperature} °C</div>
  <div class="m-2">Humidity: ${currentData.humidity}%</div>
  <div class="m-2">Wind Speed: ${currentData.windSpeed} MPH</div>
  <div class="m-2">UV Index: <span class="p-1 rounded ${uvIndexClass}">${currentData.uvIndex}</span></div>
</div></div>`;

  // append to container
  $("#main-div").append(currentWeather);
};

const renderForecastTitle = () => {
  const forecastTitle = `<div class="d-flex justify-content-center mt-3">
    <h4>7-Day Forecast:</h4>
  </div>
  <div class="d-flex flex-row flex-wrap justify-content-center m-3 border" id="7-day-forecast">`;

  $("#main-div").append(forecastTitle);
};

const renderForecastCard = (forecastData) => {
  // create elements
  const forecastWeather = `
  <div
    class="card text-white bg-dark m-2 text-center"
    style="width: 12rem"
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

const renderErrorMessage = () => {
  // clear any info on page
  $("#main-div").empty();

  // create and append error message
  const errorMessage = `<div class="text-center position-relative h-100 w-100">
  <div class="position-absolute top-50 start-50 translate-middle bg-dark text-white p-3 rounded">
  <h3>Something went wrong!</h3>
  <div>Oops, we were not able to find the city you are looking for. Please enter a valid city name.</div>
  </div>
  </div>`;
  $("#main-div").append(errorMessage);
};

const constructUrl = (cityName, lat, lon) => {
  // construct correct url based on information
  if (cityName !== "") {
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  } else {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }
};

const fetchAllWeatherData = (cityName = "Solihull") => {
  // remove previous cities weather
  $("#main-div").empty();

  // construct url
  const url = constructUrl(cityName, "", "");

  const functionForJSON = (responseObject) => responseObject.json();

  const functionForApplication = (dataFromServer) => {
    // get city name, lat and lon from data
    const cityName = dataFromServer.name;
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;

    // construct url
    const url = constructUrl("", lat, lon);

    const functionForJSON = (responseObject) => responseObject.json();

    const functionForApplication = (dataFromServer) => {
      // get current data and forecast data from dataFromServer
      const currentData = getCurrentData(cityName, dataFromServer.current);
      const forecastData = dataFromServer.daily.map(getForecastData);

      // render current and forecast data
      renderCurrentCard(currentData);
      renderForecastTitle();
      forecastData.slice(1).forEach(renderForecastCard);
    };

    const functionToHandleError = () => {
      renderErrorMessage();
    };

    fetch(url)
      .then(functionForJSON)
      .then(functionForApplication)
      .catch(functionToHandleError);
  };

  const functionToHandleError = () => {
    renderErrorMessage();
  };

  fetch(url)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

const getCitiesFromLocalStorage = () => {
  const citiesFromLocalStorage = JSON.parse(localStorage.getItem("cities"));

  return citiesFromLocalStorage ? citiesFromLocalStorage : [];
};

const onLoad = () => {
  const citiesFromLocalStorage = getCitiesFromLocalStorage();

  renderCities(citiesFromLocalStorage);

  if (citiesFromLocalStorage.length) {
    const lastCity = citiesFromLocalStorage[citiesFromLocalStorage.length - 1];

    fetchAllWeatherData(lastCity);
  }
};

const onSubmit = (event) => {
  event.preventDefault();

  const cityName = $(".form-control").val().trim();

  if (cityName) {
    const citiesFromLocalStorage = getCitiesFromLocalStorage();
    citiesFromLocalStorage.push(cityName);
    localStorage.setItem("cities", JSON.stringify(citiesFromLocalStorage));

    fetchAllWeatherData(cityName);

    renderCities(citiesFromLocalStorage);

    $(".form-control").val("");
  }
};

$(".list-group").click(onClick);
$("#form").submit(onSubmit);
$(document).ready(onLoad);
