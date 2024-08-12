import { CloudsDTO } from './clouds.dto';
import { CoordinateDTO } from './coordinate.dto';
import { MainDTO } from './main.dto';
import { RainDTO } from './rain.dto';
import { SnowDTO } from './snow.dto';
import { SystemDTO } from './system.dto';
import { WeatherConditionDTO } from './weather-condition.dto';
import { WindDTO } from './wind.dto';

export interface CurrentWeatherDTO {
  coord: CoordinateDTO;
  weather: WeatherConditionDTO;
  base: string;
  main: MainDTO;
  visibility: number;
  wind: WindDTO;
  clouds: CloudsDTO;
  rain?: RainDTO;
  snow?: SnowDTO;
  timestamp: Date;
  system: SystemDTO;
  timezone: number;
  id: number;
  name: string;
  code: number;
}
