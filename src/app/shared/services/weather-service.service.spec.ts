/* import { TestBed } from '@angular/core/testing';

import { WeatherServiceService } from './weather-service.service';

describe('WeatherServiceService', () => {
  let service: WeatherServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); */

import { TestBed, getTestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { WeatherService } from './weather-service.service';

describe('WeatherServiceService', () => {
  let injector;
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    injector = getTestBed();
    service = injector.get(WeatherService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('#getWeatherForCity', () => {
    it('should return an Observable<CityWeather>', () => {
      const city = 'London'
      const cityWeather = {
        latitude: 14.2,
        longitude: 101.3,
        temp: 34,
        desc: 'Scattered Clouds',
        name: 'London'
      }

      service.getWeatherForCity(city).subscribe(res => {
        expect(res.name).toBe('London');
      });

      const req = httpMock.expectOne(`${service.baseURL}?q=${city}&units=metric&appid=${service.apiKey}`);
      expect(req.request.method).toBe('GET');
      req.flush(cityWeather);
    });
  });

});