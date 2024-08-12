import { TestBed } from '@angular/core/testing';

import { UserSessionMenagmentService } from './user-session-menagment.service';

describe('UserSessionMenagmentService', () => {
  let service: UserSessionMenagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSessionMenagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
