import { TestBed } from '@angular/core/testing';

import {CarDetails} from './car-details.service';

describe('CarDetails', () => {
  let service: CarDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
