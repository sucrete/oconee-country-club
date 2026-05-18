// Rainbow "Open-Meteo" console log
const _omLabel = "Open-Meteo";
const _omColors = ["#FF0000","#FF7F00","#FFD700","#32CD32","#00BFFF","#9400D3","#FF69B4","#FF4500","#00CED1","#ADFF2F"];
const _omFmt = [..._omLabel].map(() => "%c%s").join("");
const _omArgs = [..._omLabel].flatMap((ch, i) => [`color:${_omColors[i % _omColors.length]};font-weight:bold;font-size:18px`, ch]);
console.log(_omFmt, ..._omArgs);

// Days of the week
const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const lat = 34.687;
const lon = -83.011;
const apiUrl =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${lat}&longitude=${lon}` +
  `&current=temperature_2m,weathercode` +
  `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
  `&temperature_unit=fahrenheit` +
  `&timezone=America%2FNew_York` +
  `&forecast_days=5`;

var weatherData;

// Map WMO weather code → Dark Sky-style icon name used by assignIcon()
function wmoToIcon(code) {
  if (code === 0) return new Date().getHours() < 20 && new Date().getHours() >= 6 ? "clear-day" : "clear-night";
  if (code <= 2) return new Date().getHours() < 20 && new Date().getHours() >= 6 ? "partly-cloudy-day" : "partly-cloudy-night";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "rain";
  return "cloudy";
}

// Human-readable description from WMO code
function wmoDescription(code) {
  if (code === 0) return "Clear";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing Rain";
  if (code >= 71 && code <= 75) return "Snow";
  if (code === 77) return "Snow Grains";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code === 95) return "Thunderstorm";
  if (code >= 96) return "Thunderstorm w/ Hail";
  return "Cloudy";
}

async function getWeather() {
  await fetch(apiUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      weatherData = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function populateDOM() {
  await getWeather();

  //~ grab all DOM elements
  const weatherIcon = document.getElementsByClassName("today-icon")[0];
  const theTemp = document.getElementsByClassName("today-temp")[0];
  const weather = document.getElementsByClassName("today-weather")[0];

  const tomorrowDay = document.getElementsByClassName("tomorrow-day")[0];
  const tomorrowWeatherIcon = document.getElementsByClassName("tomorrow-icon")[0];
  const tomorrowHiLo = document.getElementsByClassName("tomorrow-hi-lo")[0];

  const dayAfterTomorrowDay = document.getElementsByClassName("DAT-day")[0];
  const dayAfterTomorrowIcon = document.getElementsByClassName("DAT-icon")[0];
  const dayAfterTomorrowHiLo = document.getElementsByClassName("DAT-hi-lo")[0];

  const threeDaysFromTodayDay = document.getElementsByClassName("TDFT-day")[0];
  const threeDaysFromTodayIcon = document.getElementsByClassName("TDFT-icon")[0];
  const threeDaysFromTodayHiLo = document.getElementsByClassName("TDFT-hi-lo")[0];

  //~ Set Today's Weather
  const current = weatherData.current;
  const iconPath = assignIcon(wmoToIcon(current.weathercode));
  weatherIcon.src = `./assets/images/icons/weather/${iconPath}-line.svg`;
  theTemp.innerHTML = Math.ceil(current.temperature_2m);
  weather.innerHTML = wmoDescription(current.weathercode);

  const bannerTemp = document.getElementsByClassName("banner-temp")[0];
  if (bannerTemp) bannerTemp.innerHTML = Math.ceil(current.temperature_2m);

  //~ Set Forecast Days (daily[0]=today, [1]=tomorrow, [2]=DAT, [3]=TDFT)
  const daily = weatherData.daily;

  const parseDay = (dateStr) => new Date(dateStr + "T12:00").getDay();

  tomorrowDay.innerHTML = days[parseDay(daily.time[1])];
  tomorrowWeatherIcon.src = `./assets/images/icons/weather/${assignIcon(wmoToIcon(daily.weathercode[1]))}.svg`;
  tomorrowHiLo.innerHTML = `${Math.ceil(daily.temperature_2m_max[1])}°/${Math.ceil(daily.temperature_2m_min[1])}°`;

  dayAfterTomorrowDay.innerHTML = days[parseDay(daily.time[2])];
  dayAfterTomorrowIcon.src = `./assets/images/icons/weather/${assignIcon(wmoToIcon(daily.weathercode[2]))}.svg`;
  dayAfterTomorrowHiLo.innerHTML = `${Math.ceil(daily.temperature_2m_max[2])}°/${Math.ceil(daily.temperature_2m_min[2])}°`;

  threeDaysFromTodayDay.innerHTML = days[parseDay(daily.time[3])];
  threeDaysFromTodayIcon.src = `./assets/images/icons/weather/${assignIcon(wmoToIcon(daily.weathercode[3]))}.svg`;
  threeDaysFromTodayHiLo.innerHTML = `${Math.ceil(daily.temperature_2m_max[3])}°/${Math.ceil(daily.temperature_2m_min[3])}°`;
}

populateDOM();

const assignIcon = function (icon) {
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
  return iconSrc;
};
