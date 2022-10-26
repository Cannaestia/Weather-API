var apiKey = '485bbc753e29e9770f09ca55c32c6d79';

var currentEl = document.querySelector('#current');
var curInfoEl = document.querySelector('#current-info');
var fiveDayEl = document.querySelector('#five-day');
var currentDay = moment().format('MMMM Do YYYY, h:mm a');
var searchEl = document.querySelector('#searchCity');
var searchInputEl = document.querySelector('#searchInput');
console.log(currentDay)
var toJSON = function(response) {
  return response.json();
};

var displayWeather  = function (data, city) {
  console.log(data);
  var h2El = document.createElement('h2');
  var timeEl = document.createElement('h4');
  var tempEl = document.createElement('p');
  var humEl = document.createElement('p')
  var windEl = document.createElement('p')
  var uviEl = document.createElement('p')
  var imageEl = document.createElement('img');
  var icon = data.current.weather[0].icon
  imageEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  imageEl.height = 120;
  imageEl.width = 120;
  h2El.textContent = city.name;
  timeEl.textContent = currentDay;
  tempEl.textContent = 'TEMP: ' + data.current.temp + ' °F';
  humEl.textContent = 'HUMIDITY: ' + data.current.humidity + '%';
  windEl.textContent = 'WIND SPEED ' + data.current.wind_speed + ' MPH';
  uviEl.textContent = 'UV INDEX ' + data.current.uvi;
  currentEl.appendChild(h2El);
  curInfoEl.appendChild(imageEl);
  curInfoEl.appendChild(tempEl);
  curInfoEl.appendChild(humEl);
  curInfoEl.appendChild(windEl);
  curInfoEl.appendChild(uviEl);
  h2El.appendChild(timeEl);
  

  
  var dispFiveDay = data.daily.slice(1,6);
 


  console.log('HI', dispFiveDay);
};

displayBtn = function(city) {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];
  var limitCities = cities.slice(cities.length - 5);  
  searchInputEl.innerHTML = null;
  for (var city of limitCities) {
    var buttonEl = document.createElement('button');
    buttonEl.textContent = city;
    buttonEl.className = "btn btn-primary mt-3";
    searchInputEl.appendChild(buttonEl);
  }
}

var getOneCall = function (city){
  var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`;

    fetch(oneCall)
      .then(toJSON)
      .then(function(data) {
        displayWeather(data, city);
      });
};

var saveToLocalStorage = function (city) {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.push(city);
  var data = JSON.stringify(cities);
  localStorage.setItem('cities', data);
};

var getGEO = function (locations) {
  var city = locations[0];
  console.log('LAT', city.lat);
  console.log('LON', city.lon);
  saveToLocalStorage(city.name);
  displayBtn();
  getOneCall(city);
};


var handleSearch = function(event) {
 event.preventDefault(); 
 if (event.target.matches('button')) {
 var q = document.querySelector('#cityName');
 var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${apiKey}`;
 q.value = '';
 fetch(geoURL)
   .then(toJSON)
   .then(getGEO);
 }
};

var handleCityClick = function (event) {
  event.preventDefault(); 
  var q = event.target.textContent;
  var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${apiKey}`;
  q.value = '';
  fetch(geoURL)
    .then(toJSON)
    .then(getGEO);
}

  searchInputEl.addEventListener('click', handleCityClick);
  searchEl.addEventListener('click', handleSearch);


































