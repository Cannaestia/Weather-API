var apiKey = '485bbc753e29e9770f09ca55c32c6d79';
var q = 'Charlotte';
var currentEl = document.querySelector('#current');
var curInfoEl = document.querySelector('#current-info');
var currentDay = moment().format('MMMM Do YYYY, h:mm a');
var searchEl = document.querySelector('#searchCity');
var searchInputEl = document.querySelector('#searchInput');
console.log(currentDay)
var toJSON = function(response) {
  return response.json();
};
// Allows the weather to be shown on the page by creating elements and appending them. 
var displayWeather  = function (data, city) {
  console.log(data);
  currentEl.innerHTML = null;
  curInfoEl.innerHTML = null;
  currentDay.innerHTML = null;
  var fiveDayEl = document.querySelector('#five-day');
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
  

  // Shows the 5 days of the weather using a for loop to create each element with a different day and weather. Picked at index 1 - 6 ie slice, to start with the next day's weather. 
  var dispFiveDay = data.daily.slice(1,6);
  fiveDayEl.innerHTML = null;
  for (var day of dispFiveDay) {
  var date = new Date(day.dt * 1000).toLocaleDateString();
  var temp = day.temp.day;
  var colEl = document.createElement('div');
  var cardEl = document.createElement('div');
  var dateEl = document.createElement('p');
  var tempEl = document.createElement('p');
  var humEl = document.createElement('p');
  var windEl = document.createElement('p');
  var imageEl = document.createElement('img');
  var icon = day.weather[0].icon;
  imageEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  imageEl.height = 40;
  imageEl.width = 40;
  colEl.className = "card col-2 col-s p-3"
  dateEl.textContent = date;
  tempEl.textContent = 'TEMP: ' + temp + ' °F';
  humEl.textContent = 'HUMIDITY: ' + day.humidity + '%';
  windEl.textContent = 'WIND: ' + day.wind_speed + ' MPH';
  fiveDayEl.append(colEl);
  colEl.append(cardEl);
  cardEl.append(dateEl);
  cardEl.append(imageEl);
  cardEl.append(tempEl);
  cardEl.append(humEl);
  cardEl.append(windEl);
  

  }
 


  console.log('HI', dispFiveDay);
};
// Creates the button on the page that allows you to go back to a previous search. 
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
// Saves your previous search to your local database
var saveToLocalStorage = function (city) {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.push(city);
  var arrayCity = Array.from(new Set(cities));
  var data = JSON.stringify(arrayCity);
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

// setting up event listeners and how they will function. 

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


































