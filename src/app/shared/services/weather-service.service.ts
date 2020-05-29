import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { CityWeather } from '../model/city-weather-model';
import { Subject, throwError } from 'rxjs';
import { Day } from '../model/day.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey: string = 'e308e1a0c714a9fe0f80ed6770558d11';
  baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast';
  cityForecastBaseURL: string = 'https://api.openweathermap.org/data/2.5/onecall';
  cityDetail = new Subject<any>();

  constructor(private http: HttpClient) { }

  getWeatherForCity(city: string) {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('q', city);
    searchParams = searchParams.append('appid', this.apiKey);
    searchParams = searchParams.append('units', 'metric');
    return this.http.get(this.baseURL, 
      {
        params: searchParams,
        responseType: 'json'
      }
    ).pipe(
      map((res: any) => {
        let cityWeather = <CityWeather>{};
        if(res.hasOwnProperty('city')) {
          cityWeather.latitude = res.city.coord.lat;
          cityWeather.longitude = res.city.coord.lon;
          cityWeather.temp = res.list[0].main.temp;
          cityWeather.desc = res.list[0].weather[0].description;
          cityWeather.name = res.city.name;
        } else {
          cityWeather = null;
        }
        return cityWeather;
      }),
      catchError(errorRes =>{
        return throwError(errorRes);
      })
    );
  }


  fetchCityWeatherDetails(lat: number, long: number) {
    let latStr = lat.toString();
    let longStr = long.toString();
    let searchParams = new HttpParams();
    searchParams = searchParams.append('lat', latStr);
    searchParams = searchParams.append('lon', longStr);
    searchParams = searchParams.append('appid', this.apiKey);
    searchParams = searchParams.append('exclude', 'current,minutely,hourly');
    searchParams = searchParams.append('units', 'metric');
    return this.http.get(this.cityForecastBaseURL, 
      {
        params: searchParams,
        responseType: 'json'
      }
    ).pipe(
      map((res: any) => {
         let cityDetails: Day[] = [];
         let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
         if(res.hasOwnProperty('daily')) {
           res.daily.every((day, index) => {
            if(index > 4) {
              return false;
            } else {
              let cityDetail =  <Day>{} 
              let dateObj = new Date(day.dt*1000);
              cityDetail.day = days[dateObj.getDay()];
              cityDetail.date = dateObj.getDate();
              cityDetail.weather = day.weather[0].main;
              cityDetail.image = day.weather[0].icon;
              cityDetail.temp = day.temp.max + ' C';
              cityDetail.desc = day.weather[0].description;
              cityDetail.pressure = day.pressure;
              cityDetail.wind = day['wind_speed'] + ' ms ' + day['wind_deg'] + ' deg';
              cityDetails.push(cityDetail);
              return true;
            }
           });
         }
        return  cityDetails;
      }),
      catchError(errorRes =>{
        return throwError(errorRes);
      })
    );
  }

}
