import { Injectable } from '@angular/core';
import { carBrandsAndModels } from '../Data/car-brands-data';

@Injectable({
  providedIn: 'root'
})
export class CarBrandsModelsService {

  constructor() { }
  getBrandsAndModles(){
    return carBrandsAndModels;
  }
}
