import CreateStarterSetup from "./modules/CreateStarterSetup.js";
import RenderSpinner from "./modules/RenderSpinner.js";
///Startup DOM elements
const mainBody = document.querySelector("body");

const clear = function (parent) {
  parent.innerHTML = "";
};
// prettier-ignore
const createStartMarkUp = `<div class="hero-search">
  <img class="hero-search__logo" src="css/IMG/weatherAppLogo.png" alt="Logo of the wearcher app"/>
  <span>Check the weather at your location!</span><div class="form"><button class="btn btn__local" type="submit"><svg class="btn__icon--md"><use xlink:href="img/sprite.svg#icon-location"></use></svg></button><input type="text" class="hero-search__input" placeholder="Please type name of your city:)"/><span class="search__helper__text">The search field cannot be empty!</span><button class="btn hero-search__btn" type="submit"><svg class="btn__icon--sm"><use xlink:href="img/sprite.svg#icon-search"></use></svg></button></div></div><footer class="footer">Weather data provided by<a href="https://openweathermap.org/" class="footer__api-link" target="_blank">OpenWeather API</a>. Custom map provided by <a href="https://www.mapbox.com/" class="footer__api-link" target="_blank">MapBox</a>. Online weather app designed by&nbsp;<span class="footer__author"><ahref="https://www.linkedin.com/in/paweł-rochowiak-847373104"class="footer__author-link" target="_blank">Paweł Rochowiak.</a></span></footer>`;

////////////////Renders the spinner when the map is loading////////////////

const createMainMarkup = function () {
  mainBody.classList.add("body__generated");
  clear(mainBody);
  // prettier-ignore
  return ` <div class="container weatcher"><div class="weatcher__header"><img class="weatcher__header__logo" src="css/IMG/weatherAppLogo.png" alt="Logo of the wearcher app"/><div><input type="text"placeholder="search"class="weatcher__header__search"/><button class="btn" type="submit"><svg class="btn__icon--sm"><use xlink:href="img/sprite.svg#icon-search"></use></svg></button></div></div><div class="weatcher__info"><span class="weatcher__label"><span class="weatcher__label__date"></span></span><div class="weatcher__info__icon"><!-- markup genereted by JS function createMarkups -> markup name: markUpIcon--></div><div class="weatcher__info__data--details"><!-- markup genereted by JS function createMarkups -> markup name: markUpDetails--></div><div class="weatcher__info__data--map" id="map"></div></div><div class="weatcher-forecast"><div class="weatcher-forecast__sevenDays"><!-- markup genereted by JS function createMarkupForecast -> markup name: forecastMarkupTotal1-->  
</div><div class="slider__arrows"><button class="slider__btn slider__btn--left">&larr;</button><button class="slider__btn slider__btn--right">&rarr;</button></div><div class="weatcher-forecast__airStatus"><!-- markup genereted by JS function createMarkupAirStatus -> markup name: airMarkup--></div></div></div></div></div>
<footer class="footer">Weather data provided by <a href="https://openweathermap.org/" class="footer__api-link" target="_blank">OpenWeather API</a>. Custom map provided by <a href="https://www.mapbox.com/" class="footer__api-link" target="_blank">MapBox</a>. Online weather app designed by&nbsp;<span class="footer__author"><a href="https://www.linkedin.com/in/paweł-rochowiak-847373104" class="footer__author-link" target="_blank">Paweł Rochowiak.</a></span></footer>`;
};

const searchWeather = function (query) {
  mainBody.insertAdjacentHTML("afterbegin", createMainMarkup());
  createDOM();
  forecastItems.classList.add("bg-light");
  forecstItemsDisplay();
  getWeatherData(query, spinner);
};

////////////////Reverse geocoding API call////////////////

const reverseGeoCode = async function (lat, lon) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=ba5f988ea4b2ff28de77857552ff80ba`
    );
    const dataJson = await data.json();
    return dataJson;
  } catch (error) {
    showModal(mainBody, error.message);
  }
};
// prettier-ignore
let mapParentEl,logo,mainContainer,cityInput,searchBtn,weatcherMainInfo,weatcherDetails,cityLabel,forecastItems,airQuality,query,spinner,modal,btnLeft,btnRight,itemForecast,slide;

////////////////Creates MODAL window used to display errors////////////////
const showModal = function (parentEl, message) {
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `<button class="modal__close">X</button>
    <span class="modal__text">${message}</span>`;
  modalOverlay = document.createElement("div");
  modalOverlay.classList.add("overlay");
  parentEl.append(modalOverlay);
  parentEl.append(modal);
};

const hideModal = function () {
  modal?.remove();
  spinner = document.querySelector(".spinner");
  modalOverlay?.classList.toggle("hidden");
  spinner?.remove();
  if (document.body.clientWidth > 600) cityInput.focus();
};

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    hideModal();
    clear(mainBody);
    mainBody.insertAdjacentHTML("afterbegin", createStartMarkUp);
    createStarterSetUp();
  }
});
////////////////Creates DOM elements for newly creted mainMarkup////////////////
const createDOM = function () {
  mainContainer = document.querySelector(".container");
  ///Generated DOM elements
  logo = document.querySelector(".weatcher__header__logo");
  mapParentEl = document.getElementById("map");
  cityInput = document.querySelector(".weatcher__header__search");
  searchBtn = document.querySelector(".btn");
  weatcherMainInfo = document.querySelector(".weatcher__info__icon");
  // prettier-ignore
  weatcherDetails = document.querySelector(".weatcher__info__data--details");
  cityLabel = document.querySelector(".weatcher__label");
  forecastItems = document.querySelector(".weatcher-forecast__sevenDays");
  airQuality = document.querySelector(".weatcher-forecast__airStatus");
  //////////////////////////////////////////////////////////////

  if (document.body.clientWidth > 600) cityInput.focus();

  logo.addEventListener("click", function () {
    clear(mainBody);
    mainBody.insertAdjacentHTML("afterbegin", createStartMarkUp);
    createStarterSetUp();
  });

  searchBtn.addEventListener("click", function (e) {
    //e.preventDefault();
    query = cityInput.value;
    if (query !== "") {
      getWeatherData(query, spinner);
      cityInput.value = "";
    }
  });

  cityInput.addEventListener("keydown", function (e) {
    //e.preventDefault();
    if (e.key == "Enter") {
      query = cityInput.value;
      getWeatherData(query, spinner);
      cityInput.value = "";
    }
  });
};
/////////////////////////////////////////////////////////////////////////////
const addArrowsDOM = function () {
  let clicked = 0;
  //if (window.innerWidth < 590) {
  ///Buttons for forecastItems
  btnLeft = document.querySelector(".slider__btn--left");
  btnRight = document.querySelector(".slider__btn--right");
  ///Get computed style of one item////
  itemForecast = document.getElementById("0");
  const itemsArrNode = document.querySelectorAll(
    ".weatcher-forecast__sevenDays__item"
  );
  const itemsArr = Array.from(
    document.querySelectorAll(".weatcher-forecast__sevenDays__item")
  );
  const itemsGap = parseInt(window.getComputedStyle(forecastItems).gap);
  const itemCompWidth = parseInt(window.getComputedStyle(itemForecast).width);

  const slideDistance = itemsGap + itemCompWidth;

  btnRight.addEventListener("click", function () {
    clicked++;
    console.log(clicked);
    itemsArrNode.forEach((el, i) => {
      el.style.transform = `translateX(${slideDistance * clicked}px)`;
    });
  });

  btnLeft.addEventListener("click", function () {
    clicked--;

    itemsArr.forEach((el, i) => {
      el.style.transform = `translateX(${slideDistance * (i - clicked)}px)`;
    });
  });
};
////////////////Adds new class to markup with forecastItems turns into slider////////////////
const forecstItemsDisplay = function () {
  const widthWindow = document.body.clientWidth;
  if (widthWindow < 590) {
    forecastItems?.classList.add("new-order");
  }
  if (widthWindow > 590) {
    forecastItems?.classList.remove("new-order");
    const itemsArr = Array.from(
      document.querySelectorAll(".weatcher-forecast__sevenDays__item")
    );
    itemsArr.forEach((e) => {
      e.style.transform = `translateX(0px)`;
    });
  }
};

window.addEventListener("resize", function () {
  forecstItemsDisplay();
});
////////////////Displays Map for current query(location)////////////////
const displayMap = function (latitude, longitude) {
  clear(mapParentEl);
  mapboxgl.accessToken =
    "pk.eyJ1IjoidGFsZW5pa292IiwiYSI6ImNreWNva2VyYzByM3AycHBiYm5zdHl2aDUifQ.r5edy_xp-_RYy2teedRr3A";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/talenikov/ckycvun7s65vu14s0a1n11bld", // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 12, // starting zoom
  });
  // Create a new marker.
  const marker = new mapboxgl.Marker({
    color: "#5643fa",
    draggable: false,
  })
    .setLngLat([longitude, latitude])
    .addTo(map);
};
////////////////Creates markups for main weatcher display panel (main icon,temp, details(wind,humidity,realFeelTemp,pressure)////////////////
const weatcherIcons = function (icon) {
  let iconSvg;
  // prettier-ignore
  switch (icon){
    case "01d": iconSvg="icon-sun"
   break;
   case "02d": iconSvg="icon-cloudy"
   break;
   case "03d": iconSvg="icon-cloud1"
   break;
   case "04d": iconSvg="icon-cloudy1"
   break;
   case "09d": iconSvg="icon-rainy1"
   break;
   case "10d": iconSvg="icon-rainy"
   break;
   case "11d": iconSvg="icon-lightning2"
   break;
   case "13d": iconSvg="icon-snowy2"
   break;
   case "50d": iconSvg="icon-windy"
   break;
   
  }
  return iconSvg;
};

// prettier-ignore
const createMarkups = function (name,date,temp,humidity,realFeel,wind,pressure,description,icon) {
  const markUpLabel = `<span class="weatcher__label">${name}
  <span class="weatcher__label__date">${date}</span></span
>`;

let iconSvg=weatcherIcons(icon);
// prettier-ignore
  const markUpIcon = `<svg class="icon icon--dark"><use xlink:href="img/sprite.svg#${iconSvg}"></use></svg><span class="weatcher__info__icon__value">${Math.trunc(temp)}<svg class="icon"><use xlink:href="img/sprite.svg#icon-Celsius"></use></svg></span><span class="weatcher__info__icon__description">${description}</span>
  `;
// prettier-ignore
  const markUpDetails = `<div class="detail"><svg class="icon icon--dark"><use xlink:href="img/sprite.svg#icon-lines"></use></svg><span class="detail__value">${humidity} %</span><span class="detail__description">humidity</span></div><div class="detail"><svg class="icon icon--dark"><use xlink:href="img/sprite.svg#icon-Celsius"></use></svg><span class="detail__value">${Math.trunc(realFeel)}</span><span class="detail__description">realfeel</span></div><div class="detail"><svg class="icon icon--dark"><use xlink:href="img/sprite.svg#icon-wind"></use></svg><span class="detail__value">${wind}</span><span class="detail__description">wind</span></div><div class="detail"><svg class="icon icon--dark"><use xlink:href="img/sprite.svg#icon-thermometer"></use></svg><span class="detail__value">${pressure} hp</span><span class="detail__description">pressure</span></div>`;

  return [markUpLabel, markUpIcon, markUpDetails];
};

////////////////Creates markup for 7-day forecst and highlights the curren day////////////////

const createMarkupForecast = function (
  id,
  tempMin,
  tempMax,
  time,
  icon,
  active = ""
) {
  let forcastDay = new Date(time * 1000);
  let day = forcastDay.getDate();
  let iconSvg = weatcherIcons(icon);
  const status = active === 1 ? "active" : "";
  return `
        <div id=${id} class="weatcher-forecast__sevenDays__item ${status}">
          <span class="temperature">${day}</span>
          <svg class="icon">
            <use xlink:href="img/sprite.svg#${iconSvg}"></use>
          </svg>
          <div class="weatcher-forecast__sevenDays__item__minmax">
            <span class="text-sm">MIN</span>
            <span class="text-sm">MAX</span>
            <span class="temperature">${tempMin}</span
            ><span class="temperature">${tempMax}</span>
        </div></div>`;
};

const createMarkupAirStatus = function (description, pm25, pm10) {
  return `
  <div class="weatcher-forecast__airStatus__label">AIR QUALITY</div>
  <div class="weatcher-forecast__airStatus__status">${description}</div>
  <div class="weatcher-forecast__airStatus__details">
    <div class="airStatus-item">
      <div class="airStatus-item__type">PM 2.5</div>
      <div class="airStatus-item__value">${pm25}</div>
    </div>
    <div class="airStatus-item">
      <div class="airStatus-item__type">PM 2.5</div>
      <div class="airStatus-item__value">${pm10}</div>
    </div>
  </div>
`;
};

////////////////Gets latest forecast for 7 next days (including current day)////////////////

const getForecast = async function (lon, lat, excludePart) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${excludePart}&appid=ba5f988ea4b2ff28de77857552ff80ba&lang=EN&units=metric`
    );
    const dataJson = await data.json();
    console.log(dataJson);
    //export ...dataJson.hourly for the hours

    return [...dataJson.daily];
  } catch (error) {
    showModal(mainBody, error.message);
  }
};

const clearAndAddMarkup = function (
  markUpLabel,
  markUpIcon,
  markUpDetails,
  forecastMarkupTotal = "",
  airMarkup
) {
  weatcherMainInfo.innerHTML = "";
  weatcherDetails.innerHTML = "";
  cityLabel.innerHTML = "";
  airQuality.innerHTML = "";
  cityLabel.insertAdjacentHTML("afterbegin", markUpLabel);
  weatcherMainInfo.insertAdjacentHTML("afterbegin", markUpIcon);
  weatcherDetails.insertAdjacentHTML("afterbegin", markUpDetails);
  if (forecastMarkupTotal !== "") {
    forecastItems.innerHTML = "";
    forecastItems.insertAdjacentHTML("afterbegin", forecastMarkupTotal);
  }
  airQuality.insertAdjacentHTML("afterbegin", airMarkup);
};

////////////////Gets forecast for current day////////////////
const cityCheck = async function (city) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ba5f988ea4b2ff28de77857552ff80ba`
    );
    const dataJson = await data.json();
    if (dataJson.length === 0) return false;
  } catch (error) {
    return false;
  }
};

const getWeatherData = async function (city, spinner) {
  try {
    let check = await cityCheck(city);
    if (check === false)
      throw new Error("City not found. Please try&nbsp;again:)");
    RenderSpinner(mainBody);
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ba5f988ea4b2ff28de77857552ff80ba&lang=EN&units=metric`
    );

    if (!data.ok) throw new Error("City not found. Please try again:)");

    ///consuming the fetched data from Openweather API for current weatcher
    const dataJson = await data.json();
    const { feels_like: realFeel, humidity, pressure, temp } = dataJson.main;
    const wind = dataJson.wind.speed;
    const { lon: lng, lat } = dataJson.coord;
    const date = new Intl.DateTimeFormat("en-GB").format(new Date());
    const name = dataJson.name;
    //consuming the fetched data from openweather API for 7-day forecast
    const forecast7Days = await getForecast(lng, lat, "minutely");
    console.log(forecast7Days);
    const weatherDescription = forecast7Days[0].weather[0].description;
    const weatcherIcon = forecast7Days[0].weather[0].icon;

    const dataAirStatus = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=ba5f988ea4b2ff28de77857552ff80ba`
    );
    if (!dataAirStatus.ok)
      throw new Error("Information about air pollution not available");
    const dataAirStatusJson = await dataAirStatus.json();

    let airPollution;
    switch (dataAirStatusJson.list[0].main.aqi) {
      case 1:
        airPollution = "Good";
        break;
      case 2:
        airPollution = "Fair";
        break;
      case 3:
        airPollution = "Moderate";
        break;
      case 4:
        airPollution = "Poor";
        break;
      case 5:
        airPollution = "Very Poor";
        break;
    }

    //total markup for the 7-day forecast
    const forecastMarkupTotal = forecast7Days.map((el, index) =>
      createMarkupForecast(
        index,
        Math.ceil(el.temp.min),
        Math.ceil(el.temp.max),
        el.dt,
        el.weather[0].icon,
        index === 0 ? 1 : 0
      )
    );
    // prettier-ignore
    const forecastMarkupTotal1 = forecastMarkupTotal.toString().split(",").join("");

    forecastItems.addEventListener("click", function (e) {
      e.preventDefault();
      const clicked = e.target.closest(".weatcher-forecast__sevenDays__item");

      if (!clicked) return;

      const itemsArr = Array.from(
        document.querySelectorAll(".weatcher-forecast__sevenDays__item")
      );

      itemsArr.forEach((el) => el.classList.remove("active"));

      clicked.classList.add("active");

      const id = +clicked.id;

      const [markUpLabel, markUpIcon, markUpDetails] = createMarkups(
        name,
        date,
        forecast7Days[id].temp.day,
        forecast7Days[id].humidity,
        forecast7Days[id].feels_like.day,
        forecast7Days[id].wind_speed,
        forecast7Days[id].pressure,
        forecast7Days[id].weather[0].description,
        forecast7Days[id].weather[0].icon
      );
      clearAndAddMarkup(markUpLabel, markUpIcon, markUpDetails, "", airMarkup);
    });
    // prettier-ignore
    const airMarkup =  createMarkupAirStatus(
      airPollution,
      dataAirStatusJson.list[0].components.pm2_5,
      dataAirStatusJson.list[0].components.pm10
    )
    // prettier-ignore
    const [markUpLabel,markUpIcon,markUpDetails] = createMarkups(name,date,temp,humidity,realFeel,wind,pressure,weatherDescription,weatcherIcon);
    // prettier-ignore
    displayMap(lat,lng);
    clearAndAddMarkup(
      markUpLabel,
      markUpIcon,
      markUpDetails,
      forecastMarkupTotal1,
      airMarkup
    );
    forecastItems.classList.remove("bg-light");
    spinner = document.querySelector(".spinner");
    spinner.remove();
    addArrowsDOM();
  } catch (error) {
    showModal(mainBody, error.message);
  }
};
export default searchWeather;
CreateStarterSetup(mainBody, reverseGeoCode);
