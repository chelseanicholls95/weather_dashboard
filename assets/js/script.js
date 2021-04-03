const renderCities = () => {};

const fetchAllWeatherData = (cityName) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a6cdce351d249a3594ef62adb60dd561`;

  const functionForJSON = (responseObject) => responseObject.json();

  const functionForApplication = (dataFromServer) => {
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=a6cdce351d249a3594ef62adb60dd561`;

    const functionForJSON = (responseObject) => responseObject.json();

    const functionForApplication = (dataFromServer) => {
      // whatever your application code is goes here
      console.log(dataFromServer);
      // call a function getCurrentData() to get data from dataFromServer
      // getCurrentData() and store in currentData
      // getForecastData() and store in foreCastData
      // renderCurrentCardComponent(currentData)
      // renderForecastCardComponent(forecastData)
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

const onLoad = () => {
  // read from local storage and store data in variable called citiesFromLocalStorage
  const citiesFromLocalStorage = localStorage.getItem("cities");
  // if data is present and pass the data from local storage
  if (citiesFromLocalStorage) {
    renderCities(citiesFromLocalStorage);
  } else {
    localStorage.setItem("cities", "[]");
  }
  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  const length = citiesFromLocalStorage.length;
  const lastCity = citiesFromLocalStorage[length];

  fetchAllWeatherData("Birmingham");
};

$(document).ready(onLoad);
