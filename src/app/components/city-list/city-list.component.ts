import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/shared/services/weather-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityWeather } from 'src/app/shared/model/city-weather-model';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css']
})
export class CityListComponent implements OnInit {

  city: string;
  error: string;
  isSubmitted: boolean = false;
  searchForm: FormGroup;
  isLoading: boolean = false;
  selectedIndex: number;
  cities: CityWeather[];

  constructor(private weatherService : WeatherService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cities =[];
    this.searchForm = this.fb.group({
      city: ['', [Validators.required]]
    })
  }

  searchCity() {
    this.isSubmitted = true;
    if(this.searchForm.valid) {
      this.weatherService.getWeatherForCity(this.searchForm.value.city).subscribe((city: CityWeather) => {
        /** Make isSubmitted false once added to array */
        this.isSubmitted = false;
        this.searchForm.reset();
        if(this.cities.length === 8) {
          this.cities.pop();
        }
        this.selectedIndex = 0;
        this.cities.unshift(city);
        this.weatherService.cityDetail.next({latitude: city.latitude, longitude: city.longitude, name: city.name});
      },
      (error => {
        this.isSubmitted = false;
        this.searchForm.reset();
        if(error.hasOwnProperty('error')) {
          let err = error.error;
          this.error = err.message;
          setTimeout(() => {
            this.error = null;
          }, 3000);
        }
      }));
    }
  }

  onSubmit() {
    console.log(this.searchForm);
    this.searchCity();
  }

  onRefresh(city, index) {
    this.isLoading = true;
    this.selectedIndex = index;
    this.weatherService.getWeatherForCity(city.name).subscribe((city: CityWeather) => {
      this.isLoading = false;
      this.cities[index] = city;
      //this.weatherService.cityDetail.next({latitude: city.latitude, longitude: city.longitude, name: city.name});
    });
  }

  onDelete(index) {
    this.cities.splice(index, 1);
    if(this.cities.length === 0) {
      this.weatherService.cityDetail.next(null);
    } else {
      let latitude;
      let longitude;
      let name;
      if(index === 0) {
        latitude = this.cities[index].latitude;
        longitude = this.cities[index].longitude;
        name = this.cities[index].name;
      } else {
        latitude = this.cities[index - 1].latitude;
        longitude = this.cities[index - 1].longitude;
        name = this.cities[index - 1].name;
      }
      this.weatherService.cityDetail.next({latitude: latitude, longitude: longitude, name: name});
    }
  }

  onClearAll() {
    this.cities = [];
    this.weatherService.cityDetail.next(null);
  }

  selectCity(city, index) {
    this.selectedIndex = index;
    this.weatherService.cityDetail.next({latitude: city.latitude, longitude: city.longitude, name: city.name});
  }

}
