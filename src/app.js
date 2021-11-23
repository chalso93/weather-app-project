//Update to current date
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
let dayFull = daysFull[now.getDay()];
let hours = [now.getHours()];
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = [now.getMinutes()];
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let time = now.toLocaleTimeString();
let todayDate = document.querySelector("h1.date");
todayDate.innerHTML = `${date}`;
let month = document.querySelector("h2.month");
month.innerHTML = `${monthFull}`;
let day = document.querySelector("h3.day");
day.innerHTML = `${dayFull} ${hours}:${minutes}`;
