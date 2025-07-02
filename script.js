// NEOWEATHER APP JAVASCRIPT
class NeoWeather {
    constructor() {
        // Using OpenMeteo - completely free, no API key needed!
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        this.weatherUrl = 'https://api.open-meteo.com/v1/forecast';
        
        this.initializeElements();
        this.bindEvents();
        this.initializeDarkMode();
        this.initializeDesignThemes();
        this.showDefaultState();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.weatherDisplay = document.getElementById('weatherDisplay');
        this.errorMessage = document.getElementById('errorMessage');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.themeMenuToggle = document.getElementById('themeMenuToggle');
        this.themeMenu = document.getElementById('themeMenu');
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        // Forecast elements
        this.hourlyForecast = document.getElementById('hourlyForecast');
        this.dailyForecast = document.getElementById('dailyForecast');
        this.hourlyScroll = document.getElementById('hourlyScroll');
        this.dailyContainer = document.getElementById('dailyContainer');
        
        // Weather data elements
        this.cityName = document.getElementById('cityName');
        this.country = document.getElementById('country');
        this.temperature = document.getElementById('temperature');
        this.feelsLike = document.getElementById('feelsLike');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherMain = document.getElementById('weatherMain');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Dark mode toggle
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Theme menu toggle
        this.themeMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleThemeMenu();
        });

        // Design theme option selection
        this.themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.getAttribute('data-theme');
                this.setDesignTheme(theme);
                this.hideThemeMenu();
            });
        });

        // Close theme menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeMenuToggle.contains(e.target) && !this.themeMenu.contains(e.target)) {
                this.hideThemeMenu();
            }
        });
        
        // Auto-uppercase input
        this.cityInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }

    initializeDarkMode() {
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        this.setDarkMode(savedDarkMode);
    }

    initializeDesignThemes() {
        // Check for saved design theme or default to neobrutalism
        const savedDesignTheme = localStorage.getItem('designTheme') || 'neobrutalism';
        this.setDesignTheme(savedDesignTheme);
    }

    toggleDarkMode() {
        const currentDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        this.setDarkMode(!currentDarkMode);
    }

    setDarkMode(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDark);
        
        // Update button text and icon
        const modeIcon = this.darkModeToggle.querySelector('.mode-icon');
        const modeText = this.darkModeToggle.querySelector('.mode-text');
        
        if (isDark) {
            modeIcon.textContent = '☀️';
            modeText.textContent = 'LIGHT';
        } else {
            modeIcon.textContent = '🌙';
            modeText.textContent = 'DARK';
        }
    }

    toggleThemeMenu() {
        this.themeMenu.classList.toggle('show');
    }

    hideThemeMenu() {
        this.themeMenu.classList.remove('show');
    }

    setDesignTheme(theme) {
        // Remove all theme classes from both body and html
        const themeClasses = ['theme-neobrutalism', 'theme-clean', 'theme-minimal', 'theme-retro'];
        document.body.classList.remove(...themeClasses);
        document.documentElement.classList.remove(...themeClasses);
        
        // Add new theme class
        if (theme !== 'neobrutalism') {
            document.body.classList.add(`theme-${theme}`);
            document.documentElement.classList.add(`theme-${theme}`);
        }
        
        localStorage.setItem('designTheme', theme);
        
        // Update active theme option
        this.themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            }
        });
    }

    showDefaultState() {
        this.hideError();
        this.weatherDisplay.style.display = 'block';
        // Hide forecast sections initially
        this.hourlyForecast.style.display = 'none';
        this.dailyForecast.style.display = 'none';
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        
        if (!city) {
            this.showError('ENTER A CITY NAME!');
            return;
        }

        this.showLoading();
        
        try {
            // First, get coordinates for the city
            const coordinates = await this.getCoordinates(city);
            
            // Then get weather data using coordinates
            const weatherData = await this.fetchWeatherData(coordinates);
            
            this.displayWeatherData(weatherData, coordinates);
            this.hideError();
        } catch (error) {
            this.showError('CITY NOT FOUND OR API ERROR!');
            console.error('Weather API Error:', error);
        }
    }

    async getCoordinates(city) {
        const url = `${this.geocodingUrl}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Geocoding error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }
        
        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude,
            name: data.results[0].name,
            country: data.results[0].country_code?.toUpperCase() || data.results[0].country
        };
    }

    async fetchWeatherData(coordinates) {
        // First try with basic current weather only
        const currentUrl = `${this.weatherUrl}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&timezone=auto`;
        
        console.log('Fetching current weather from URL:', currentUrl);
        
        try {
            const currentResponse = await fetch(currentUrl);
            if (!currentResponse.ok) {
                const errorText = await currentResponse.text();
                console.error('Current Weather API Error:', errorText);
                throw new Error(`Current weather API error! status: ${currentResponse.status}`);
            }
            const currentData = await currentResponse.json();
            
            // Now try to get forecast data
            const forecastUrl = `${this.weatherUrl}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
            
            console.log('Fetching forecast from URL:', forecastUrl);
            
            try {
                const forecastResponse = await fetch(forecastUrl);
                if (forecastResponse.ok) {
                    const forecastData = await forecastResponse.json();
                    // Combine current and forecast data
                    return {
                        current: currentData.current,
                        hourly: forecastData.hourly,
                        daily: forecastData.daily
                    };
                } else {
                    console.warn('Forecast data not available, using current weather only');
                    return currentData;
                }
            } catch (forecastError) {
                console.warn('Forecast fetch failed, using current weather only:', forecastError);
                return currentData;
            }
            
        } catch (error) {
            console.error('Weather API Error:', error);
            throw error;
        }
    }

    displayWeatherData(data, coordinates) {
        // Location
        this.cityName.textContent = coordinates.name.toUpperCase();
        this.country.textContent = coordinates.country;

        // Temperature (OpenMeteo uses Celsius by default)
        this.temperature.textContent = Math.round(data.current.temperature_2m);
        this.feelsLike.textContent = Math.round(data.current.apparent_temperature);

        // Weather condition
        const weatherInfo = this.getWeatherFromCode(data.current.weather_code);
        this.weatherMain.textContent = weatherInfo.main.toUpperCase();
        this.weatherDescription.textContent = weatherInfo.description;
        this.weatherIcon.textContent = weatherInfo.icon;

        // Details
        this.humidity.textContent = `${Math.round(data.current.relative_humidity_2m)}%`;
        this.windSpeed.textContent = `${Math.round(data.current.wind_speed_10m)} KM/H`;
        this.pressure.textContent = `${Math.round(data.current.surface_pressure)} HPA`;
        this.visibility.textContent = 'N/A'; // OpenMeteo doesn't provide visibility

        // Show forecast sections
        console.log('Weather data received:', data);
        console.log('Hourly data:', data.hourly);
        console.log('Daily data:', data.daily);
        
        if (data.hourly) {
            this.displayHourlyForecast(data.hourly);
            this.hourlyForecast.style.display = 'block';
        } else {
            console.warn('No hourly data available');
            this.hourlyForecast.style.display = 'none';
        }
        
        if (data.daily) {
            this.displayDailyForecast(data.daily);
            this.dailyForecast.style.display = 'block';
        } else {
            console.warn('No daily data available');
            this.dailyForecast.style.display = 'none';
        }
        
        this.weatherDisplay.style.display = 'block';
        this.hideLoading();
    }

    displayHourlyForecast(hourlyData) {
        console.log('Displaying hourly forecast:', hourlyData);
        this.hourlyScroll.innerHTML = '';
        
        if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m) {
            console.error('Invalid hourly data:', hourlyData);
            return;
        }
        
        // Show next 24 hours
        const maxHours = Math.min(24, hourlyData.time.length);
        for (let i = 0; i < maxHours; i++) {
            const time = new Date(hourlyData.time[i]);
            const temp = Math.round(hourlyData.temperature_2m[i]);
            const weatherCode = hourlyData.weather_code[i];
            const weatherInfo = this.getWeatherFromCode(weatherCode);
            
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            
            // Highlight current hour
            if (i === 0) {
                hourlyItem.classList.add('current');
            }
            
            const timeString = i === 0 ? 'JETZT' : time.toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            hourlyItem.innerHTML = `
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-icon">${weatherInfo.icon}</div>
                <div class="hourly-temp">${temp}°</div>
                <div class="hourly-desc">${weatherInfo.main}</div>
            `;
            
            this.hourlyScroll.appendChild(hourlyItem);
        }
    }

    displayDailyForecast(dailyData) {
        console.log('Displaying daily forecast:', dailyData);
        this.dailyContainer.innerHTML = '';
        
        if (!dailyData || !dailyData.time || !dailyData.temperature_2m_max) {
            console.error('Invalid daily data:', dailyData);
            return;
        }
        
        // Show 7 days
        const maxDays = Math.min(7, dailyData.time.length);
        for (let i = 0; i < maxDays; i++) {
            const date = new Date(dailyData.time[i]);
            const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
            const minTemp = Math.round(dailyData.temperature_2m_min[i]);
            const weatherCode = dailyData.weather_code[i];
            const weatherInfo = this.getWeatherFromCode(weatherCode);
            
            const dayName = i === 0 ? 'HEUTE' : 
                           i === 1 ? 'MORGEN' : 
                           date.toLocaleDateString('de-DE', { weekday: 'long' }).toUpperCase();
            
            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item';
            
            dailyItem.innerHTML = `
                <div class="daily-day">${dayName}</div>
                <div class="daily-icon">${weatherInfo.icon}</div>
                <div class="daily-temps">
                    <div class="daily-high">${maxTemp}°</div>
                    <div class="daily-low">${minTemp}°</div>
                </div>
                <div class="daily-desc">${weatherInfo.main}</div>
            `;
            
            this.dailyContainer.appendChild(dailyItem);
        }
    }

    
    getWeatherFromCode(code) {
        // OpenMeteo Weather Codes
        const weatherCodes = {
            0: { main: 'Clear', description: 'Clear sky', icon: '☀️' },
            1: { main: 'Mainly Clear', description: 'Mainly clear', icon: '🌤️' },
            2: { main: 'Partly Cloudy', description: 'Partly cloudy', icon: '⛅' },
            3: { main: 'Overcast', description: 'Overcast', icon: '☁️' },
            45: { main: 'Fog', description: 'Fog', icon: '🌫️' },
            48: { main: 'Fog', description: 'Depositing rime fog', icon: '🌫️' },
            51: { main: 'Drizzle', description: 'Light drizzle', icon: '🌦️' },
            53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '🌦️' },
            55: { main: 'Drizzle', description: 'Dense drizzle', icon: '🌧️' },
            56: { main: 'Drizzle', description: 'Light freezing drizzle', icon: '🌨️' },
            57: { main: 'Drizzle', description: 'Dense freezing drizzle', icon: '🌨️' },
            61: { main: 'Rain', description: 'Slight rain', icon: '🌧️' },
            63: { main: 'Rain', description: 'Moderate rain', icon: '🌧️' },
            65: { main: 'Rain', description: 'Heavy rain', icon: '🌧️' },
            66: { main: 'Rain', description: 'Light freezing rain', icon: '🌨️' },
            67: { main: 'Rain', description: 'Heavy freezing rain', icon: '🌨️' },
            71: { main: 'Snow', description: 'Slight snow fall', icon: '❄️' },
            73: { main: 'Snow', description: 'Moderate snow fall', icon: '❄️' },
            75: { main: 'Snow', description: 'Heavy snow fall', icon: '❄️' },
            77: { main: 'Snow', description: 'Snow grains', icon: '❄️' },
            80: { main: 'Rain', description: 'Slight rain showers', icon: '🌦️' },
            81: { main: 'Rain', description: 'Moderate rain showers', icon: '🌧️' },
            82: { main: 'Rain', description: 'Violent rain showers', icon: '🌧️' },
            85: { main: 'Snow', description: 'Slight snow showers', icon: '🌨️' },
            86: { main: 'Snow', description: 'Heavy snow showers', icon: '🌨️' },
            95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '⛈️' },
            96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '⛈️' },
            99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '⛈️' }
        };
        
        return weatherCodes[code] || { main: 'Unknown', description: 'Unknown weather', icon: '🌡️' };
    }

    showLoading() {
        this.searchBtn.textContent = 'LOADING...';
        this.searchBtn.disabled = true;
        this.searchBtn.classList.add('loading');
    }

    hideLoading() {
        this.searchBtn.textContent = 'GET WEATHER';
        this.searchBtn.disabled = false;
        this.searchBtn.classList.remove('loading');
    }

    showError(message) {
        this.errorMessage.querySelector('#errorText').textContent = message;
        this.errorMessage.classList.add('show');
        this.weatherDisplay.style.display = 'none';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.classList.remove('show');
        this.weatherDisplay.style.display = 'block';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeoWeather();
});

// Add some console messages
console.log(`
███╗   ██╗███████╗ ██████╗ ██╗    ██╗███████╗ █████╗ ████████╗██╗  ██╗███████╗██████╗ 
████╗  ██║██╔════╝██╔═══██╗██║    ██║██╔════╝██╔══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗
██╔██╗ ██║█████╗  ██║   ██║██║ █╗ ██║█████╗  ███████║   ██║   ███████║█████╗  ██████╔╝
██║╚██╗██║██╔══╝  ██║   ██║██║███╗██║██╔══╝  ██╔══██║   ██║   ██╔══██║██���══╝  ██╔══██╗
██║ ╚████║███████╗╚██████╔╝╚███╔███╔╝███████╗██║  ██║   ██║   ██║  ██║███████╗██║  ██║
╚═╝  ╚═══╝╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                                                        
CLEAN. MODERN. WEATHER.
`);

console.log('🎨 NEOWEATHER APP INITIALIZED');
console.log('🌤️ POWERED BY OPENMETEO - COMPLETELY FREE!');
console.log('🔄 NO API KEY NEEDED - UNLIMITED REQUESTS');
console.log('🌓 Theme System: Light, Dark modes + 4 design themes available');
console.log('🌍 Real-time weather data from open-meteo.com');