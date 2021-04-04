const renderCities = () => {};

const getDate = (dt) => {
  var utcSeconds = dt;
  var date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  date.toDateString();
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

const fetchAllWeatherData = (cityName) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a6cdce351d249a3594ef62adb60dd561&units=metric`;

  const functionForJSON = (responseObject) => responseObject.json();

  const functionForApplication = (dataFromServer) => {
    const cityName = dataFromServer.name;
    const lat = dataFromServer.coord.lat;
    const lon = dataFromServer.coord.lon;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=a6cdce351d249a3594ef62adb60dd561&units=metric`;

    const functionForJSON = (responseObject) => responseObject.json();

    const functionForApplication = (dataFromServer) => {
      // whatever your application code is goes here
      // call a function getCurrentData() to get data from dataFromServer
      const currentData = getCurrentData(cityName, dataFromServer.current);
      // getCurrentData() and store in currentData
      const forecastData = dataFromServer.daily.forEach(getForecastData);
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

  fetchAllWeatherData("Solihull");
};

$(document).ready(onLoad);
