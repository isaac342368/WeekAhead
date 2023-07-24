const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Endpoint to handle the weather API request
app.get('/weather', async (req, res) => {
  const { city, unit } = req.query;
  
  // Make the API call to the weather API using the city and unit parameters
  const weatherData = await getWeatherCondition(city, unit);
  
  // Return the weather data back to the client
  res.json(weatherData);
});

// Function to fetch weather data from the API
async function getWeatherCondition(city, unit) {
  const params = new URLSearchParams({
    access_key: 'd171684972b38dd430db2f91c3564710',
    query: city,
    units: unit
  });

  const url = `https://api.weatherstack.com/current?${params}`;

  const response = await fetch(url);
  const weatherCondition = await response.json();

  return weatherCondition;
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
