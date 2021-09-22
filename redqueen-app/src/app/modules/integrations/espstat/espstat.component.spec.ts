import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspstatComponent } from './espstat.component';

describe('EspstatComponent', () => {
  let component: EspstatComponent;
  let fixture: ComponentFixture<EspstatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspstatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
