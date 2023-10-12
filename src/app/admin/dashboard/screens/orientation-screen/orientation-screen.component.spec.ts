import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationScreenComponent } from './orientation-screen.component';

describe('OrientationScreenComponent', () => {
  let component: OrientationScreenComponent;
  let fixture: ComponentFixture<OrientationScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrientationScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
