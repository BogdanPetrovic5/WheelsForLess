import { TestBed } from '@angular/core/testing';

import { CarBrandsModelsService } from './car-details.service';

describe('CarBrandsModelsService', () => {
  let service: CarBrandsModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarBrandsModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
