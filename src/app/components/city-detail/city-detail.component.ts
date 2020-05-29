import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from 'src/app/shared/services/weather-service.service';
import { Subscription } from 'rxjs';
import { Day } from 'src/app/shared/model/day.model';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.css']
})
export class CityDetailComponent implements OnInit, OnDestroy {
  latitude: number;
  longitude: number;
  name: string;
  error: string;
  refreshMode: boolean = false;
  isLoading: boolean = false;
  sub: Subscription;
  days:Day[];
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.days = [];
    this.sub = this.weatherService.cityDetail.subscribe(data =>{
      if(data) {
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.name = data.name;
        this.fetchCityWeatherDetails();
      } else {
        this.latitude = null;
        this.longitude = null;
        this.name = null;
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchCityWeatherDetails(refreshMode?) {
    this.isLoading = true;
    this.refreshMode = refreshMode;
    this.weatherService.fetchCityWeatherDetails(this.latitude, this.longitude).subscribe((response: Day[]) =>  {
      this.isLoading = false;
      this.refreshMode = false;
      this.days = response;
      console.log('days', this.days);
    },
    (error => {
      this.isLoading = false;
      this.refreshMode = false;
      console.log(error);
      if(error.hasOwnProperty('error')) {
        let err = error.error;
        this.error = err.message;
        setTimeout(() => {
          this.error = null;
        }, 2500);
      }
    }))
  }

  getImagePath(weather) {
    let imagePath = '';
    switch(weather) {
      case 'Clouds':
        imagePath = 'assets/cloud.svg';
        break;
      case 'Rain':
        imagePath = 'assets/rain.svg';
        break;
      case 'Snow':
        imagePath = 'assets/snow.svg';
        break;
      default:
        imagePath = 'assets/day.svg';
    }
    return  imagePath;
  }


}
