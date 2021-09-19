import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClcontrollerComponent } from './clcontroller.component';

describe('ClcontrollerComponent', () => {
  let component: ClcontrollerComponent;
  let fixture: ComponentFixture<ClcontrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClcontrollerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClcontrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
