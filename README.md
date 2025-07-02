# 🌦️ NeoWeather – Themeable Weather Website

A lightweight weather website built with **HTML**, **CSS**, and **JavaScript**. It fetches live data from the **Open-Meteo API** and displays current weather, 7-day forecasts, and hourly developments. No frameworks. No API keys. Just weather.

---

## ✨ Features

- 🎨 Multiple themes: **Neobrutalism**, **Clean**, **Minimalist**, **Dark Mode**
- 📡 Real-time weather via [Open-Meteo](https://open-meteo.com)
- 📅 **7-day forecast** (min & max temperatures, condition)
- ⏱️ **Hourly weather trend** for each selected day
- 📱 Fully responsive on desktop and mobile
- 🔓 **No API key** required
- 🧱 100% built with **vanilla JS**, **HTML**, and **CSS**

---

## 🚀 Quick Start

1. Download or clone this repository
2. Open `index.html` in your browser
3. Enter a city name to view weather info

---

## 🌐 Open-Meteo API

Data source:  
`https://api.open-meteo.com/v1/forecast`

Parameters used:
- `latitude`, `longitude`
- `daily`: `temperature_2m_max`, `temperature_2m_min`, `weathercode`
- `hourly`: `temperature_2m`, `precipitation_probability`, `weathercode`
- `timezone=auto`

---

## 🎨 Built-in Themes

You can switch between the following UI styles:

- 🟡 **Neobrutalism** – Bold colors, thick borders, raw UI
- ⚪ **Clean** – Simple layout, soft design
- 📉 **Minimalist** – No clutter, just the data
- 🌑 **Dark Mode** – Eye-friendly with low brightness

Themes are toggled via CSS classes on the `<body>` element.

---

## 🎨 Customize Colors

Edit theme variables in `style.css`:

```css
:root {
  --black: #000000;
  --white: #ffffff;
  --accent-yellow: #ffff00;
  --accent-blue: #0066ff;
  --accent-red: #ff0000;
  --accent-green: #00ff00;
  --accent-pink: #ff00ff;
}
```

---

## 🖋️ Fonts

Default font: `JetBrains Mono`  
To change it:
- Modify the `<link>` in `index.html`
- Update the `font-family` in `style.css`

---

## 📁 File Structure

```
NeoWeather/
├── index.html       # Main layout
├── style.css        # Theme styling and variables
├── script.js        # Weather logic and API interaction
└── README.md        # This file
```

---

## 📱 Responsive Design

- 🖥️ Desktop: Full interface with weather cards and hover effects
- 📱 Mobile: Stacked layout with simplified interaction

---

## ✅ Browser Support

Tested on:
- Chrome ✅
- Firefox ✅
- Edge ✅
- Safari ✅

Built using:
- ES6 JavaScript
- CSS Grid + Flexbox
- Fetch API

---

## 🌤️ Weather Data Shown

- 🌡️ Temperature + feels-like
- 🌥️ Weather condition (with icons or emojis)
- 💧 Humidity
- 🌬️ Wind speed
- 📍 City & Country
- 📆 7-Day forecast
- 📈 Hour-by-hour development

---

## ⚠️ Error Handling

- ❗ No input → warning shown
- 🚫 Invalid city → error message
- 🔌 API/network error → fallback message

---

## 💡 Tips

- 🆓 Open-Meteo is free to use, no registration required
- 🧪 Use this for personal projects, portfolios, or UI prototypes
- ⚙️ Easy to extend with more metrics (rain, wind gusts, etc.)

---

**NeoWeather – Just HTML, CSS & JS. No extras. No nonsense.**
