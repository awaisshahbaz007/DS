import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentItemPopupComponent } from './recent-item-popup.component';

describe('RecentItemPopupComponent', () => {
  let component: RecentItemPopupComponent;
  let fixture: ComponentFixture<RecentItemPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentItemPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
