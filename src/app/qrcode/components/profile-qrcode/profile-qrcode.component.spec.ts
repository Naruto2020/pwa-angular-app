import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileQrcodeComponent } from './profile-qrcode.component';

describe('ProfileQrcodeComponent', () => {
  let component: ProfileQrcodeComponent;
  let fixture: ComponentFixture<ProfileQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileQrcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
