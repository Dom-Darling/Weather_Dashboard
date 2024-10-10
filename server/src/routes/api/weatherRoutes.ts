import { Router } from 'express';
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';
import axios from 'axios';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const cityName = req.body.city;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Get location data (latitude and longitude) from city name
    const locationResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${process.env.OPEN_WEATHER_API_KEY}`);
    const locationData = locationResponse.data[0];
    const { lat, lon } = locationData;

    // Get weather data using latitude and longitude
    const weatherData = await WeatherService.getWeatherData(lat, lon);

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Respond with weather data
    res.json(weatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const cityId = req.params.id;
    await HistoryService.removeCity(cityId);
    res.json({ message: 'City removed from search history' });
  } catch (error) {
    console.error('Error removing city from search history:', error);
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;