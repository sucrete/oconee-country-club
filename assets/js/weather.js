//~ Standard Variables
const latLong = "34.687,-83.011";
const apiUrl = `https://api.pirateweather.net/forecast/EqRw5datS5zL99ze3FwQ8Q7PJEtJAC0i/${latLong}?exclude=minutely,hourly,alerts,flags`;

var weatherData;

//~ First call Pirate Weather API
async function getWeather() {
  await fetch(apiUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      weatherData = data;
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//~ converts js time to abbreviated readable day
const getDayReadable = (thyme) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(thyme * 1000);

//~ Begin DOM manipulation - fired when fetch to API is finished - receives data object
async function populateDOM() {
  await getWeather();
  // now you can directly use jsonData
  console.log("weather data: -> ", JSON.stringify(weatherData, null, 2));
  // console.log()
  //~ identify next day in weatherData.daily.data array
  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0);

  const morrow = new Date(todaysDate);
  console.log('todays "date"', new Date());
  // console.log('todays "date"', new Date());
  morrow.setDate(todaysDate.getDate() + 1);
  // console.log("today ->", new Date().getTime());
  // console.log("on the morrow ->", morrow.getTime());

  const tomorrowSeconds = Math.floor(morrow.getTime() / 1000);

  console.log("tomorrow seconds", JSON.stringify(tomorrowSeconds, null, 2));
  // Find index of object that matches tomorrow at midnight
  const nextDayIndex = weatherData.daily.data.findIndex(
    (obj) => obj.time === tomorrowSeconds
  );

  // Next day weather object's time will need to be converted by multiplying by 1000

  //~ grab all DOM elements
  // today
  const weatherIcon = document.getElementsByClassName("today-icon")[0];
  const theTemp = document.getElementsByClassName("today-temp")[0];
  const weather = document.getElementsByClassName("today-weather")[0];
  const bannerTemp = document.getElementsByClassName("banner-temp")[0];

  // tomorrow
  const tomorrowDay = document.getElementsByClassName("tomorrow-day")[0];
  const tomorrowWeatherIcon =
    document.getElementsByClassName("tomorrow-icon")[0];
  const tomorrowHiLo = document.getElementsByClassName("tomorrow-hi-lo")[0];

  // day after tomorrow
  const DATDay = document.getElementsByClassName("DAT-day")[0];
  const DATWeatherIcon = document.getElementsByClassName("DAT-icon")[0];
  const DATHiLo = document.getElementsByClassName("DAT-hi-lo")[0];

  // three days from today
  const TDFTDay = document.getElementsByClassName("TDFT-day")[0];
  const TDFTWeatherIcon = document.getElementsByClassName("TDFT-icon")[0];
  const TDFTHiLo = document.getElementsByClassName("TDFT-hi-lo")[0];

  //~ Set Today's Weather
  // console.log(weatherData.currently.icon);
  const today = weatherData.currently;
  // set today's icon
  const iconPath = assignIcon(today.icon);
  weatherIcon.src = `./assets/images/icons/weather/${iconPath}-line.svg`;

  // set today's temperature readable
  theTemp.innerHTML = Math.ceil(today.temperature);

  // set today's weather readable
  weather.innerHTML = today.summary;

  //* ...aaaaand if on homepage, set the banner weather
  if (bannerTemp) {
    bannerTemp.innerHTML = Math.ceil(today.temperature);
  }

  //~ set tomorrow's Weather
  const tomorrow = weatherData.daily.data[nextDayIndex];
  console.log("tomorrow object ->", JSON.stringify(tomorrow, null, 2));
  // multiply by 1000 to convert to JS time which is based on milliseconds
  tomorrowDay.innerHTML = getDayReadable(tomorrow.time);
  tomorrowWeatherIcon.src = `./assets/images/icons/weather/${assignIcon(
    tomorrow.icon
  )}.svg`;
  tomorrowHiLo.innerHTML = `${
    Math.ceil(tomorrow.temperatureHigh) +
    "°/" +
    Math.ceil(tomorrow.temperatureLow) +
    "°"
  }`;

  //~ set day after tomorrow's Weather
  const DAT = weatherData.daily.data[nextDayIndex + 1];
  DATDay.innerHTML = getDayReadable(DAT.time);
  DATWeatherIcon.src = `./assets/images/icons/weather/${assignIcon(
    DAT.icon
  )}.svg`;
  DATHiLo.innerHTML = `${
    Math.ceil(DAT.temperatureHigh) + "°/" + Math.ceil(DAT.temperatureLow) + "°"
  }`;

  //~ set three days from today's Weather
  const TDFT = weatherData.daily.data[nextDayIndex + 2];
  TDFTDay.innerHTML = getDayReadable(TDFT.time);
  TDFTWeatherIcon.src = `./assets/images/icons/weather/${assignIcon(
    TDFT.icon
  )}.svg`;
  TDFTHiLo.innerHTML = `${
    Math.ceil(TDFT.temperatureHigh) +
    "°/" +
    Math.ceil(TDFT.temperatureLow) +
    "°"
  }`;
}

getWeather();
populateDOM();

const assignIcon = function (icon) {
  // console.log(`%c${icon}`, "color: orange");
  let iconSrc;
  if (icon == "clear-day" || icon == "clear-night") {
    iconSrc = "sun";
  } else if (icon == "rain") {
    iconSrc = "rain";
  } else if (icon == "snow" || icon == "sleet") {
    iconSrc = "snow";
  } else if (icon == "wind") {
    iconSrc = "wind";
  } else if (icon == "fog") {
    iconSrc = "foggy";
  } else if (icon == "cloudy") {
    iconSrc = "cloudy";
  } else if (icon == "partly-cloudy-day" || icon == "partly-cloudy-night") {
    iconSrc = "part-cloud";
  }
  // console.log(`%c${iconSrc}`, "color: yellow");
  return iconSrc;
};
