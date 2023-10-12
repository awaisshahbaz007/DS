import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPaiedScreensComponent } from './no_paired_screens.component';

describe('NoPaiedScreensComponent', () => {
  let component: NoPaiedScreensComponent;
  let fixture: ComponentFixture<NoPaiedScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPaiedScreensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoPaiedScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
