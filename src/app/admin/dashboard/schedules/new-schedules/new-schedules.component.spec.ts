import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSchedulesComponent } from './new-schedules.component';

describe('NewSchedulesComponent', () => {
  let component: NewSchedulesComponent;
  let fixture: ComponentFixture<NewSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSchedulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
