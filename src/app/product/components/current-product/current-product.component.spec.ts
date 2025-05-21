import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentProductComponent } from './current-product.component';

describe('CurrentProductComponent', () => {
  let component: CurrentProductComponent;
  let fixture: ComponentFixture<CurrentProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
