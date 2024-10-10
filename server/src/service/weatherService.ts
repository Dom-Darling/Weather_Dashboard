import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org';
  private apiKey: string = process.env.WEATHER_API_KEY || '';

  constructor() {}

  // Fetch location data based on the city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await axios.get(`${this.baseURL}/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 1,
          appid: this.apiKey,
        },
      });
      const locationData = response.data[0];
      return {
        lat: locationData.lat,
        lon: locationData.lon,
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Failed to fetch location data');
    }
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/data/2.5/weather`, {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lon,
          appid: this.apiKey,
          units: 'imperial', // Use 'metric' for Celsius
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  // Get weather data for a city
  public async getWeatherForCity(city: string): Promise<any> {
    try {
      const coordinates = await this.fetchLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      return weatherData;
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw new Error('Failed to get weather for city');
    }
  }
}

export default new WeatherService();