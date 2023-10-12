import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaircodeComponent } from './paircode.component';

describe('PaircodeComponent', () => {
  let component: PaircodeComponent;
  let fixture: ComponentFixture<PaircodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaircodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaircodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
