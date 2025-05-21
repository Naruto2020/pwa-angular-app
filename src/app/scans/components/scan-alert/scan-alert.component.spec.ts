import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanAlertComponent } from './scan-alert.component';

describe('ScanAlertComponent', () => {
  let component: ScanAlertComponent;
  let fixture: ComponentFixture<ScanAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
