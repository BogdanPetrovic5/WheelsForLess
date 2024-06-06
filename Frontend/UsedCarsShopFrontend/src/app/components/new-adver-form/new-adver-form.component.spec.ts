import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdverFormComponent } from './new-adver-form.component';

describe('NewAdverFormComponent', () => {
  let component: NewAdverFormComponent;
  let fixture: ComponentFixture<NewAdverFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAdverFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAdverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
