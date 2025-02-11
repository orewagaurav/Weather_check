const apiKey = '93ace5e5837641d9a11190721251002';
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

async function getWeather() {
    const location = document.getElementById('locationInput').value;
    if (!location) {
        showError('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

function displayWeather(data) {
    const { location, current } = data;
    weatherInfo.classList.add('active');
    errorMessage.style.display = 'none';

    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    document.getElementById('temp').textContent = current.temp_c;
    document.getElementById('condition').textContent = current.condition.text;
    document.getElementById('weatherIcon').src = current.condition.icon;
    document.getElementById('humidity').textContent = current.humidity;
    document.getElementById('wind').textContent = current.wind_kph;
    document.getElementById('feelsLike').textContent = current.feelslike_c;

    // Update background based on condition
    updateBackground(current.condition.code, current.is_day);
}

function updateBackground(conditionCode, isDay) {
    const gradients = {
        sunny: ['#FFD700', '#FF8C00'],
        cloudy: ['#B0C4DE', '#778899'],
        rainy: ['#4682B4', '#1E90FF'],
        snowy: ['#87CEEB', '#F0FFFF'],
        night: ['#2E3192', '#1B1464']
    };

    const background = isDay ?
        (conditionCode === 1000 ? gradients.sunny :
            conditionCode > 1000 && conditionCode < 1030 ? gradients.cloudy :
                conditionCode >= 1063 && conditionCode <= 1087 ? gradients.rainy :
                    gradients.cloudy) : gradients.night;

    document.body.style.background = `linear-gradient(45deg, ${background[0]}, ${background[1]})`;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.classList.remove('active');
    document.body.style.background = `linear-gradient(45deg, var(--primary), var(--secondary))`;
}

document.getElementById('locationInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') getWeather();
});