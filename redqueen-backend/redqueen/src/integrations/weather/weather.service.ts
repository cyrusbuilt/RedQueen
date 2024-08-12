import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import Configuration from 'src/configuration';
import { CurrentWeatherDTO } from 'src/integrations/weather/dto/current-weather.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  public async getCurrentWeather(
    lat: number,
    lon: number,
  ): Promise<CurrentWeatherDTO> {
    const url = `${Configuration.shared.weatherApiUrl}/weather/current?lat=${lat}&lon=${lon}`;
    this.logger.info(`Requesting weather data from url: ${url} ...`);

    const { data } = await firstValueFrom(
      this.httpService.get<CurrentWeatherDTO>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new InternalServerErrorException(error.response.data);
        }),
      ),
    );

    return data;
  }
}
