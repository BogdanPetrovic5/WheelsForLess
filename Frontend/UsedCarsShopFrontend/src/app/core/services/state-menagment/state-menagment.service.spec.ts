import { TestBed } from '@angular/core/testing';
import { StateMenagmentService } from './state-menagment.service';



describe('StateMenagmentService', () => {
  let service: StateMenagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateMenagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
