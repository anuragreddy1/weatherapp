import React, { useEffect, useState } from 'react';
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

// Register chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function WeatherChart() {
  const [chartData, setChartData] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const weather = await getCurrentWeather('Hyderabad');
      const temp = weather.main.temp;

      setCurrentTemp(temp);

      // Example: simulate 5 hourly points using slight variations
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
    }

    fetchData();
  }, []);

  return (
    <div style={{ width: '90%', margin: 'auto', textAlign: 'center' }}>
      <h2>Temperature Graph</h2>
      {currentTemp !== null && (
        <p style={{ fontSize: '20px', marginBottom: '10px' }}>
          Current Temperature: <strong>{currentTemp} °C</strong>
        </p>
      )}
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default WeatherChart;

