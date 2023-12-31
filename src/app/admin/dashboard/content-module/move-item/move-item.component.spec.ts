import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveItemComponent } from './move-item.component';

describe('MoveItemComponent', () => {
  let component: MoveItemComponent;
  let fixture: ComponentFixture<MoveItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
