import { Injectable } from '@angular/core';
import { carBrandsAndModels } from '../../../Data/car-brands-data';
import { bodyType } from '../../../Data/car-body-type';
import { fuel } from '../../../Data/fuel-type';
import { propulsion } from '../../../Data/propulsion-type';

@Injectable({
  providedIn: 'root'
})
export class CarDetails {

  constructor() { }
  getBrandsAndModles(){
    return carBrandsAndModels;
  }
  getBodyTypes(){
    return bodyType;
  }
  getFuelTypes(){
    return fuel;
  }
  getPropulsionTypes(){
    return propulsion
  }
}
