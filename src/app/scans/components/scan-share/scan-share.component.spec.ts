import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanShareComponent } from './scan-share.component';

describe('ScanShareComponent', () => {
  let component: ScanShareComponent;
  let fixture: ComponentFixture<ScanShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
