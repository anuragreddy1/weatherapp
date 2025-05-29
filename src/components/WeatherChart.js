// WeatherChart.js
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const API_KEY = 'dcf428a35b51b285bbea3af873503f79'; // Replace with your OpenWeatherMap API key

function WeatherChart() {
  const [cityInput, setCityInput] = useState('');
  const [cityName, setCityName] = useState('');
  const [currentTemp, setCurrentTemp] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');

      const data = await res.json();
      setCityName(data.city.name);
      setError(null);

      const nextHours = data.list.slice(0, 6); // Next 6 data points (3-hour intervals)
      const labels = nextHours.map((entry) =>
        new Date(entry.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const temps = nextHours.map((entry) => entry.main.temp);

      setCurrentTemp(temps[0]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temps,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      });
    } catch (err) {
      setError('City not found or weather data unavailable.');
      setCityName('');
      setCurrentTemp(null);
      setChartData(null);
    }
  };

  const handleSearch = () => {
    if (cityInput.trim()) {
      fetchWeather(cityInput.trim());
    }
  };

  return (
    <div style={{ width: '90%', margin: 'auto', textAlign: 'center' }}>
      <h2>Weather Dashboard</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        style={{ padding: '8px', width: '200px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
        Search
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {cityName && <h3 style={{ marginTop: '20px' }}>City: {cityName}</h3>}
      {currentTemp !== null && (
        <p style={{ fontSize: '20px', marginBottom: '10px' }}>
          Current Temperature: <strong>{currentTemp} °C</strong>
        </p>
      )}
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p style={{ marginTop: '20px' }}>No data to display.</p>
      )}
    </div>
  );
}

export default WeatherChart;
