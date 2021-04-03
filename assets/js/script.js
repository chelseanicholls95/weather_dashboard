const renderCities = () => {};

const fetchAllWeatherData = () => {};

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

  fetchAllWeatherData(lastCity);
};

$(document).ready(onLoad);
