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

let now = new Date();
let date = [now.getDate()];
let monthFull = monthsFull[now.getMonth()];
let todayDate = document.querySelector("h1.date");
todayDate.innerHTML = `${date}`;
let month = document.querySelector("h2.month");
month.innerHTML = `${monthFull}`;
let dayFull = daysFull[now.getDay()];
let day = document.querySelector("h3.day");
day.innerHTML = `${dayFull}`;

let apiKey = "a3884259e65dd8019ea13ff5e3dffbcf";
let input = document.querySelector("#search-input");
let searchLocation = document.querySelector("#location");

//Convert temperature
function convertToFarenheit(event) {
  event.preventDefault();
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
}

let farenheit = document.querySelector("#unitFar");
farenheit.addEventListener("click", convertToFarenheit);

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
}

let farenheitTemperature = "null";
let celciusTemperature = "null";
let minFarenheit = "null";
let maxFarenheit = "null";
let minCelcius = "null";
let maxCelcius = "null";
let celcius = document.querySelector("#unitCel");
celcius.addEventListener("click", convertToCelcius);

//Show temperature
function showTemp(response) {
  console.log(response.data);
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
  let windData = Math.round(response.data.wind.speed);
  windkmh.innerHTML = `${windData} km/h`;
  let converttomph = Math.round(`${windData}` / 1.609);
  windmph.innerHTML = `${converttomph} mph`;
  let humidityData = response.data.main.humidity;
  humidity.innerHTML = `${humidityData}%`;
  let day = document.querySelector("h3.day");
  day.innerHTML = formatDate(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
let temperatureElement = document.querySelector("#temp");
let degree = `°`;
let minTemp = document.querySelector("#min-temp");
let maxTemp = document.querySelector("#max-temp");
let tempDescription = document.querySelector("#temp-description");
let windkmh = document.querySelector("#wind-kmh");
let windmph = document.querySelector("#wind-mph");
let humidity = document.querySelector("#humidity-description");

//Search location
function locationSubmit(event) {
  event.preventDefault();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(showTemp);
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

let gpsLocation = document.querySelector("#current-location-btn");
gpsLocation.addEventListener("click", getPosition);
