import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteDashboardComponent } from './favorite-dashboard.component';

describe('FavoriteDashboardComponent', () => {
  let component: FavoriteDashboardComponent;
  let fixture: ComponentFixture<FavoriteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
