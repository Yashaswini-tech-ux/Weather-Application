const apiKey = "4884407421b413410b6dbc3ab6ba18b6"; // Replace with your OpenWeather API key
const searchForm = document.querySelector(".search-form");
const cityInput = document.querySelector(".city-input");
const cityName = document.querySelector(".city");
const dateElement = document.querySelector(".date");
const descriptionText = document.querySelector(".description-text");
const tempElement = document.querySelector(".temp");
const windSpeedElement = document.querySelector(".wind-speed");
const humidityElement = document.querySelector(".humidity");
const visibilityElement = document.querySelector(".visibility-distance");
const weatherIcon = document.querySelector(".description i");
const weatherApp = document.querySelector(".weather-app");

const errorMessage = document.createElement("p");
errorMessage.classList.add("error-message");
weatherApp.appendChild(errorMessage);

let isCelsius = true;
let temperatureCelsius = 0;

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === 200) {
                updateWeatherUI(data);
                errorMessage.textContent = ""; // Clear error message on successful search
            } else {
                displayError("City not found. Please enter a valid city name.");
            }
        })
        .catch(() => {
            displayError("Error fetching weather data. Please try again.");
        });
}

function updateWeatherUI(data) {
    const now = new Date();
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", options);

    cityName.textContent = data.name;
    dateElement.textContent = formattedDate;
    descriptionText.textContent = data.weather[0].description;
    windSpeedElement.textContent = `${data.wind.speed} KM/H`;
    humidityElement.textContent = `${data.main.humidity}%`;
    visibilityElement.textContent = `${(data.visibility / 1000).toFixed(1)} KM`;

    temperatureCelsius = data.main.temp;
    updateTemperature();

    const weatherCode = data.weather[0].icon;
    weatherIcon.textContent = getWeatherIcon(weatherCode);

    updateBackground(data.weather[0].main); // Set background image based on weather condition
}

function updateTemperature() {
    if (isCelsius) {
        tempElement.textContent = `${Math.round(temperatureCelsius)}°C`;
    } else {
        const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
        tempElement.textContent = `${Math.round(temperatureFahrenheit)}°F`;
    }
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    updateTemperature();
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("visible");
}

// Function to update background based on weather condition
function updateBackground(weatherCondition) {
    let backgroundImage = "";

    switch (weatherCondition.toLowerCase()) {
        case "sunny":
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/Sunny.jpg')";
            break;
        case "cloudy":
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/Cloudy.jpg')";
            break;
        case "rainy":
        case "drizzle":
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/rainy.jpg')";
            break;
        case "thunderstorm":
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/storm.jpg')";
            break;
        case "snow":
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/snow.jpg')";
            break;
        case "mist":
        case "foggy":
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/Foggy.jpg')";
            break;
        default:
            backgroundImage = "url('https://raw.githubusercontent.com/Yashaswini-tech-ux/Weather-Application/main/deafult.jpg')"; // Fallback background
    }

    weatherApp.style.backgroundImage = backgroundImage;
    weatherApp.style.backgroundSize = "cover";
    weatherApp.style.backgroundPosition = "center";
    weatherApp.style.transition = "background 0.5s ease-in-out";
}

function getWeatherIcon(iconCode) {
    const iconMapping = {
        "01d": "wb_sunny", 
        "01n": "nightlight",
        "02d": "partly_cloudy_day",
        "02n": "nights_stay",
        "03d": "cloud",
        "03n": "cloud",
        "04d": "cloud_queue",
        "04n": "cloud_queue",
        "09d": "rainy",
        "09n": "rainy",
        "10d": "rainy",
        "10n": "rainy",
        "11d": "thunderstorm",
        "11n": "thunderstorm",
        "13d": "ac_unit",
        "13n": "ac_unit",
        "50d": "foggy",
        "50n": "foggy"
    };
    return iconMapping[iconCode] || "wb_cloudy";
}

// Add a button to toggle temperature
const tempToggleBtn = document.createElement("button");
tempToggleBtn.textContent = "°C / °F";
tempToggleBtn.classList.add("temp-toggle-btn");
tempToggleBtn.addEventListener("click", toggleTemperature);
document.querySelector(".temperature-info").appendChild(tempToggleBtn);
