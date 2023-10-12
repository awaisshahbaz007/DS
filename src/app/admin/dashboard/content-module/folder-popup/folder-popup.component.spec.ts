import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderPopupComponent } from './folder-popup.component';

describe('FolderPopupComponent', () => {
  let component: FolderPopupComponent;
  let fixture: ComponentFixture<FolderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
