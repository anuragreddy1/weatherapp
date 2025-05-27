import React, {useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getCurrentWeather } from '../services/WeatherService';
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

function WeatherChart() {
  const [cityInput, setCityInput] = useState('');
  const [cityName, setCityName] = useState('');
  const [currentTemp, setCurrentTemp] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (city) => {
    try {
      const weather = await getCurrentWeather(city);
      const temp = weather.main.temp;

      setCityName(weather.name);
      setCurrentTemp(temp);
      setError(null);

      // Fake past/future temps for visual variation
      const labels = ['10 AM', '11 AM', '12 PM', '1 PM', 'Now'];
      const temps = [temp - 2, temp - 1, temp, temp + 1, temp + 2];

      setChartData({
        labels: labels,
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
      setError('City not found. Please try again.');
      setChartData(null);
      setCurrentTemp(null);
      setCityName('');
    }
  };

  const handleSearch = () => {
    if (cityInput.trim() !== '') {
      fetchData(cityInput.trim());
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
      {chartData ? <Line data={chartData} /> : <p style={{ marginTop: '20px' }}>No data to display.</p>}
    </div>
  );
}

export default WeatherChart;
