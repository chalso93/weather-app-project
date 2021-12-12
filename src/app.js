//Update to current date
function formatDate(timestamp) {
  let dateTimestamp = new Date(timestamp);
  let hours = dateTimestamp.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = dateTimestamp.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let day = daysFull[dateTimestamp.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let dateTimestamp = new Date(timestamp);
  let date = dateTimestamp.getDate();
  return `${date}`;
}

function formatMonth(timestamp) {
  let dateTimestamp = new Date(timestamp);
  let monthFull = monthsFull[dateTimestamp.getMonth()];
  return `${monthFull}`;
}

let daysFull = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let monthsFull = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let apiKey = "a3884259e65dd8019ea13ff5e3dffbcf";
let input = document.querySelector("#search-input");
let searchLocation = document.querySelector("#location");
let temperatureElement = document.querySelector("#temp");
let minTemp = document.querySelector("#min-temp");
let maxTemp = document.querySelector("#max-temp");
let tempDescription = document.querySelector("#temp-description");
let windkmh = document.querySelector("#wind-kmh");
let windmph = document.querySelector("#wind-mph");
let humidity = document.querySelector("#humidity-description");
let farenheitTemperature = "null";
let celciusTemperature = "null";
let minFarenheit = "null";
let maxFarenheit = "null";
let minCelcius = "null";
let maxCelcius = "null";
let minForecastCelcius = "null";
let maxForecastCelcius = "null";
let minForecastFar = "null";
let maxForecastFar = "null";
let farenheit = document.querySelector("#unitFar");
let celcius = document.querySelector("#unitCel");

//Search location
function locationSubmit(event) {
  event.preventDefault();
  let locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=${apiKey}`;
  axios
    .get(locationUrl)
    .then(showTemp)
    .catch(function error() {
      if (error) {
        searchLocation.innerHTML = `city not found`;
        alert("city not found");
      }
    });
  searchLocation.innerHTML = `${input.value}`;
}

let enterLocation = document.querySelector("#search-form");
enterLocation.addEventListener("submit", locationSubmit);

//GPS location
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let gpsUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  let nameUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  axios.get(`${gpsUrl}`).then(showTemp);
  axios.get(`${nameUrl}`).then(showName);
  function showName(response) {
    let cityName = response.data[0].name;
    searchLocation.innerHTML = `${cityName}`;
  }
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
  document.getElementById("search-input").value = "";
}

function convertForecastFar() {
  let locationDetail = searchLocation.innerHTML;
  let locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationDetail}&units=metric&appid=${apiKey}`;
  axios.get(`${locationUrl}`).then(forecastFarenheit);
}
function convertForecastCel() {
  let locationDetail = searchLocation.innerHTML;
  let locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationDetail}&units=metric&appid=${apiKey}`;
  axios.get(`${locationUrl}`).then(forecastCelcius);
}

let gpsLocation = document.querySelector("#current-location-btn");
gpsLocation.addEventListener("click", getPosition);

//Show temperature
function showTemp(response) {
  celciusTemperature = response.data.main.temp;
  farenheitTemperature = (`${celciusTemperature}` * 9) / 5 + 32;
  let temperature = Math.round(response.data.main.temp);
  minCelcius = response.data.main.temp_min;
  maxCelcius = response.data.main.temp_max;
  minFarenheit = (`${minCelcius}` * 9) / 5 + 32;
  maxFarenheit = (`${maxCelcius}` * 9) / 5 + 32;
  let minTemperature = Math.round(response.data.main.temp_min);
  let maxTemperature = Math.round(response.data.main.temp_max);
  temperatureElement.innerHTML = `${temperature}`;
  tempDescription.innerHTML = response.data.weather[0].description;
  minTemp.innerHTML = Math.round(`${minTemperature}`);
  maxTemp.innerHTML = Math.round(`${maxTemperature}`);
  let windData = Math.round(response.data.wind.speed * 3.6);
  windkmh.innerHTML = `${windData} `;
  let converttomph = Math.round(`${windData}` / 1.609);
  windmph.innerHTML = `${converttomph} `;
  let humidityData = response.data.main.humidity;
  humidity.innerHTML = `${humidityData}%`;
  let day = document.querySelector("h3.day");
  day.innerHTML = formatDate(response.data.dt * 1000);
  let month = document.querySelector("h2.month");
  month.innerHTML = formatMonth(response.data.dt * 1000);
  let todayDate = document.querySelector("h1.date");
  todayDate.innerHTML = formatDay(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

//Forecast
function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayShort[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index !== 0 && index < 6) {
      minForecastCelcius = forecastDay.temp.min;
      maxForecastCelcius = forecastDay.temp.max;
      maxForecastFar = (`${maxForecastCelcius}` * 9) / 5 + 32;
      minForecastFar = (`${minForecastCelcius}` * 9) / 5 + 32;
      forecastHTML += `<div class="card" id = "card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">
                     <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="60"
          height="60"
        /> ${formatForecastDay(forecastDay.dt)}</h5>
                <h6 class="card-subtitle mb-2 text-muted" id="forecastTemps"><span id = "forecastMax">${Math.round(
                  maxForecastCelcius
                )}</span><span class = "maxdegree">°</span><span class = "mindegree"> | </span><span id = "forecastMin">${Math.round(
        minForecastCelcius
      )}</span><span class = "mindegree">°</span></h6>
              </div>
            </div>         
          </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(displayForecast);
}

//Convert temperature
let convertFarenheit = document.querySelector("#unitFar");
convertFarenheit.addEventListener("click", convertToFarenheit);
let convertCelcius = document.querySelector("#unitCel");
convertCelcius.addEventListener("click", convertToCelcius);

function convertToFarenheit() {
  celcius.classList.remove("active");
  farenheit.classList.add("active");
  celcius.classList.add("notActive");
  farenheit.classList.remove("notActive");
  let farenheitTemp = Math.round((`${celciusTemperature}` * 9) / 5 + 32);
  temperatureElement.innerHTML = `${farenheitTemp}`;
  let minFarTemp = Math.round((`${minCelcius}` * 9) / 5 + 32);
  let maxFarTemp = Math.round((`${maxCelcius}` * 9) / 5 + 32);
  minTemp.innerHTML = `${minFarTemp}`;
  maxTemp.innerHTML = `${maxFarTemp}`;
  convertForecastFar();
}

function forecastFarenheit(response) {
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let FarenheitUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  axios.get(`${FarenheitUrl}`).then(convertFarForecast);
}
function forecastCelcius(response) {
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let FarenheitUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(`${FarenheitUrl}`).then(displayForecast);
}

function convertFarForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index !== 0 && index < 6) {
      minForecastFar = forecastDay.temp.min;
      maxForecastFar = forecastDay.temp.max;

      forecastHTML += `<div class="card" id = "card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">
                     <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="60"
          height="60"
        /> ${formatForecastDay(forecastDay.dt)}</h5>
                <h6 class="card-subtitle mb-2 text-muted" id="forecastTemps"><span id = "forecastMax">${Math.round(
                  maxForecastFar
                )}</span><span class = "maxdegree">°</span><span class = "mindegree"> | </span><span id = "forecastMin">${Math.round(
        minForecastFar
      )}</span><span class = "mindegree">°</span></h6>
              </div>
            </div>         
          </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function convertToCelcius(event) {
  event.preventDefault();
  farenheit.classList.remove("active");
  celcius.classList.add("active");
  farenheit.classList.add("notActive");
  celcius.classList.remove("notActive");
  let celciusTemp = Math.round(((`${farenheitTemperature}` - 32) * 5) / 9);
  temperatureElement.innerHTML = `${celciusTemp}`;
  let minCelTemp = Math.round(((`${minFarenheit}` - 32) * 5) / 9);
  let maxCelTemp = Math.round(((`${maxFarenheit}` - 32) * 5) / 9);
  minTemp.innerHTML = `${minCelTemp}`;
  maxTemp.innerHTML = `${maxCelTemp}`;
  convertForecastCel();
}

function initialSearch() {
  searchLocation.innerHTML = `Brisbane`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Brisbane&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showTemp);
}

initialSearch();
