import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserToUserMessagesComponent } from './user-to-user-messages.component';

describe('UserToUserMessagesComponent', () => {
  let component: UserToUserMessagesComponent;
  let fixture: ComponentFixture<UserToUserMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserToUserMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserToUserMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
