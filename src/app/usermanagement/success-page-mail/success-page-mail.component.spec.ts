import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPageMailComponent } from './success-page-mail.component';

describe('SuccessPageMailComponent', () => {
  let component: SuccessPageMailComponent;
  let fixture: ComponentFixture<SuccessPageMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessPageMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessPageMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
