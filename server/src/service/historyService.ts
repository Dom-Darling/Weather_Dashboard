import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}

// Complete the HistoryService class
export class HistoryService {
  private cities: string[] = [];

  public async addCity(city: string): Promise<void> {
    this.cities.push(city);
  }

  public async getCities(): Promise<string[]> {
    return this.cities;
  }

  public async removeCity(city: string): Promise<void> {
    this.cities = this.cities.filter(c => c !== city);
  }
}

export default new HistoryService();
